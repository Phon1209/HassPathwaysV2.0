import { IPathwayDescriptionSchema, ICourseClusterSchema } from "@/public/data/dataInterface";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import path from "path";
import { error } from "console";

type PathwayRequest = {
  params: {
    pathwayName: string;
  };
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const pathwayName =  searchParams.get("pathwayName");
    const catalogYear = searchParams.get("catalogYear");
    if (!pathwayName) {
        console.log("error: no pathway name");
        return NextResponse.error();
    }
    if (!catalogYear) {
        console.log("error: no catalog year");
        return NextResponse.error();
    }
    const pathways = JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "json") + `/${catalogYear}` + "/pathways.json",
          "utf8"
        )
    );

    let schema: Array<ICourseClusterSchema> = [];
    let allCourses: Array<string> = [];

    let description: string = "";
    let remainingHeader: string = "";

    if (!pathways[pathwayName]) {
        console.log("error: no pathway found");
        let res = {
            description: "no pathway found",
            compatibleMinor: ["no pathway found"],
            courses: ["no pathway found"],
            clusters: []
        }
        return NextResponse.json(res);
    }

    for (let key of Object.keys(pathways[pathwayName])) {
        if (key == "description"){
            description = pathways[pathwayName][key];
        }
        else if (key == "remaining_header"){
            remainingHeader = pathways[pathwayName][key];
        }
        else if (key == "name" || key == "minor"){
            continue;
        }
        else{
            let temp_courses: Array<string> = [];
            for (let course_name of Object.keys(pathways[pathwayName][key])){
                let full_code: string = pathways[pathwayName][key][course_name];
                let formatted_code: string = full_code.replace(" ", "-");
                if (full_code.length == 8){
                    formatted_code = full_code.substring(0, 4) + "-" + full_code.substring(4);
                }
                temp_courses.push(formatted_code);
                allCourses.push(formatted_code);
            }
            let temp_description: string = "";
            let temp_name: string = key;
            if (key == 'Remaining'){
                temp_description = pathways[pathwayName]["remaining_header"] ? pathways[pathwayName]["remaining_header"] : "Take your remaining courses from this list:";
            } else{
                if (key == "Required"){
                    if (temp_courses.length == 1){
                        temp_description = "You must take the following course:";
                    } else {
                        temp_description = "Take all of the following courses:";
                    }
                } else {
                    temp_description = "You must take one of the following courses:";
                    temp_name = "One Of";
                }
            }
            let num = 3;
            if (key != "Remaining"){
                num = 1;
            }
            if (key == "Required"){
                num = temp_courses.length;
            }
            let cluster: ICourseClusterSchema = {
                name: temp_name,
                numCourses: num,
                description: temp_description,
                courses: temp_courses
            };
            schema.push(cluster);
        }
    }

    for (let cluster of schema){
        if (cluster.name == "Remaining"){
            schema.splice(schema.indexOf(cluster), 1);
            schema.push(cluster);
            break;
        }
    }

    let res: IPathwayDescriptionSchema = {
        description: description,
        compatibleMinor: pathways[pathwayName]["minor"] ? pathways[pathwayName]["minor"] : [],
        courses: allCourses,
        clusters: schema
    };
    return NextResponse.json(res);
}
