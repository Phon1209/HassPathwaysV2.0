
const { XMLParser } = require("fast-xml-parser");

// Catalog API makes certain information an attribute, but don't 
// want to include all attributes b/c of a lot of useless data
const optionsAttributes = {
    ignoreDeclaration: true,
    ignoreAttributes: false ,
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if( name == "core") return true;
    }
};
const optionsNoAttributes = {
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if( name == "core") return true;
    }
};

const parser = new XMLParser(optionsNoAttributes);
const parserN = new XMLParser(optionsAttributes);


const BASE_URL = "http://rpi.apis.acalog.com/v1/"
const DEFAULT_QUERY_PARAMS = "?key=3eef8a28f26fb2bcc514e6f1938929a1f9317628&format=xml"
const CHUNK_SIZE = 100

async function fetchXML(url) {
    return new Promise(async (resolve, reject) => {
        var response = await fetch(url);
        var xml = await response.text();
        resolve(parserN.parse(xml));
    });
}

// Recursively gets all children of an object that are strings
function getAllChildren(key, root) {
    var collected = [];

    if (root == undefined || typeof root == 'string') {
        return [];
    }

    for (const [k, v] of Object.entries(root)) {
        if (k == key) {
            collected.push(v);
            continue;
        }
        let recursed = getAllChildren(key, root[k])
        if (recursed.length != 0) {
            recursed.forEach(e => {
                collected.push(e)
            })
        }
    }
    return collected;
}

// Finds the courses from the result of getAllChildren
function findCourses(key, root, prereqs) {
    var arrayed = getAllChildren(key, root);
    var objected = [];
    arrayed.forEach(element => {
        let splited = element.split("&#xA0;-&#xA0;")
        if (splited[1] != undefined) {
            var code = splited[0].replace(' ', '-');
            // Find tags
            tags = [];
            if (prereqs[code] != undefined) {
                tags = prereqs[code]["attributes"];
            }

            objected.push({
                title: splited[1],
                courseCode: code,
                tag: tags
            });
        }
    })
    return objected;
}

async function getCatalogs() {
    return new Promise(async (resolve, reject) => {
        var url = `${BASE_URL}content${DEFAULT_QUERY_PARAMS}&method=getCatalogs`;
        var results = await fetchXML(url);
        let cataloged = [];
        
        for (var i = 0; i < results.catalogs.catalog.length; i++) {
            year = (results.catalogs.catalog[i]["a:title"]["#text"]).split("Rensselaer Catalog ")[1];
            id = (results.catalogs.catalog[i]["@_id"]).split("acalog-catalog-")[1];
            let tmp = {};
            tmp.id = id;
            tmp.year = year;
            cataloged.push(tmp);
        }
        resolve(cataloged);
    })
}

async function getCourseIDS(cid) {
    return new Promise(async (resolve, reject) => {
        var url = `${BASE_URL}search/programs${DEFAULT_QUERY_PARAMS}&method=listing&options[limit]=0&catalog=${cid}` 
        var results = await fetchXML(url);
        var listed = [];
        for (var i = 0; i < results.catalog.search.results.result.length; i++) {
            if (JSON.stringify(results.catalog.search.results.result[i]).includes("Pathway")) {
                listed.push(results.catalog.search.results.result[i].id);
            }
        }
        var ans = `${BASE_URL}content${DEFAULT_QUERY_PARAMS}&format=xml&method=getItems&options[full]=1&catalog=${cid}&type=programs`;
        for (var i = 0; i < listed.length; i++) {
            ans = ans.concat("&ids[]=", listed[i]);
        }
        resolve(ans);
    })
}


function getAllStrings(arg) {
    if (typeof arg === "string") {
        return [arg];
    }

    // handle wrong types and null
    if (typeof arg !== "object" || !arg) {
        return [];
    }

    return Object.keys(arg).reduce((acc, key) => {
        return [...acc, ...getAllStrings(arg[key])];
    }, []);
};


function printAll(core, d) {
    if (typeof core === "string") {
        d.desc += core; 
        return;
    }
    for (var key in core) {
        if (key == "courses") continue;
        if (core[key] != null) {
            printAll(core[key], d);
        }
    }
}


// Main function that cleans up the data
function clean(parsed, prereqs) {
    let raw = parsed.catalog.programs.program;
    let pathways = {};
    for (var i = 0; i < raw.length; i++) {

        let pathway = {};
        // Make sure it's a pathway and not a minor

        if (raw[i]["type"][0]["xi:include"]["xi:fallback"] != "Integrative Pathway") {
            continue;
        }

        pathway.department = "";
        pathway.name = (raw[i]["a:title"]).replace("Pathway", "").trim();
        //pathway.college = (raw[i]["parent"]["xi:include"]["xi:fallback"])


        var desc = raw[i]["a:content"]["h:p"];
        /*
        if (typeof desc != 'string') {
            desc = getAllStrings(desc).reduce(
                function (a, b) {
                    return a.length > b.length ? a : b;
                }
            );
            ; 

        }*/

        pathway.description = desc;
        if (desc["h:p"] != undefined) {
            desc = desc["h:p"];
        }
        pathway.clusters = [];
        pathway.compatibleMinor = [];
        pathway.concentrations = [];
        // Getting courses needed
        if (raw[i].cores.length != 0) {
            for (var j = 0; j < raw[i].cores.core.length; j++) {
                var core = raw[i].cores.core[j];

                // What type of course?
                var coursesCategory = core["a:title"]
                title = core["a:title"];
                delete core["a:title"]
                var cluster = { 
                    name: coursesCategory, 
                    description: core["a:content"], 
                    courses: findCourses("a:title", core, prereqs)
                }
                if (cluster.description["h:p"] != undefined) {
                    cluster.description = cluster.description["h:p"];
                }

                if (title.toLowerCase().includes("requirements")) {
                    // Object in order to pass by reference
                    d = {desc : ""};
                    printAll(core, d);
                    d.desc = d.desc.trim().replaceAll("&#xA0;", " ")
                    if (d.desc != "") {
                        pathway.requirements = d.desc;
                    }
                    if (Object.keys(cluster.courses).length > 0) pathway.clusters.push(cluster);
                }
                else if (title.toLowerCase().includes("one of")) {
                    if (Object.keys(cluster.courses).length != 0) pathway.clusters.push(cluster);
                }
                else if (title.toLowerCase().includes("required")) {
                    if (Object.keys(cluster.courses).length != 0) pathway.clusters.push(cluster);
                }
                else if (title.toLowerCase().includes("minor")) {
                    pathway.compatibleMinor = (getAllChildren("a:title", core))
                }
                else if (title.toLowerCase().includes("choose")) {
                    if (Object.keys(cluster.courses).length != 0) pathway.clusters.push(cluster);
                }
                else {
                    console.log(title)
                    if (Object.keys(cluster.courses).length != 0) pathway.concentrations.push(cluster);
                }


            }
        }
        pathways[pathway.name] = (pathway);
    }
    return pathways;
}

// Gets the data and creates the file
async function data() {
    console.log(url)
    const response = await fetch(url);
    const xml = await response.text();
    const file = Bun.file("prerequisites.json");
    const prereqs = await file.json();

    let parsed = clean(parser.parse(xml), prereqs);
    //console.log(parsed);
    await Bun.write("./pathways.json", JSON.stringify(parsed));
    var deps = Object.keys(parsed);
    var ans = {};
    for (const name of deps) {
        ans[name] = "";
    }
    //await Bun.write("./departments.json", JSON.stringify(ans));
    format();
}

// Changes the file into the v2.0 format 
async function format() {
    const file = Bun.file("pathways.json");
    const file2 = Bun.file("departments.json");
    const data = await file.json();
    const deps = await file2.json(); 
    var formated = {};
    for (const key in data) {
        var dep = deps[key]; 
        if (!(dep in formated)) formated[dep] = [];
        delete data[key]["department"]
        formated[dep].push(data[key])
    }
    var arrayed = [];
    for (const key in formated) {
        arrayed.push({
            department: key,
            pathways: formated[key]
        })
    }
    await Bun.write("./formatted.json", JSON.stringify(arrayed))
}

// RUN IT
async function main() {
    var catalog = await getCatalogs();
    catalog = catalog.find((e) => e.year == "2023-2024");
    url = await getCourseIDS(catalog.id);


    await data();
    //await format();
}

main();