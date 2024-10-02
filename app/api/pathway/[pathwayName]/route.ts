import { IPathwayDescriptionSchema, ICourseClusterSchema, ICourseSchema } from "@/public/data/dataInterface";
import { NextRequest, NextResponse } from "next/server";
import { ICourseClusterSchema, ICourseSchema } from "@/public/data/dataInterface";
import { useAppContext } from "@/app/contexts/appContext/AppProvider";
import * as fs from "fs";
import path from "path";

type PathwayRequest = {
  params: {
    pathwayName: string;
  };
};

export async function GET(request: NextRequest, data: PathwayRequest) {
    const searchParams  = request.nextUrl.searchParams;
    const pathwayName =  searchParams.get("pathwayName");
    const { courses, catalog_year } = useAppContext();
    if (!pathwayName) {
        return NextResponse.error();
    }
    const pathways = JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "json") + `/${catalog_year}` + "/pathways.json",
          "utf8"
        )
    );

    let schema: Array<ICourseClusterSchema> = [];
    let allCourses: Array<ICourseSchema> = [];

    let description: string = "";
    let remainingHeader: string = "";

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
            let temp_courses: Array<ICourseSchema> = [];
            for (let course_name of Object.keys(pathways[pathwayName][key])){
                let full_code: string = pathways[pathwayName][key][course_name];

                let formatted_code: string = full_code.replace(" ", "-");
                for (let course of courses){
                    if (course.courseCode == formatted_code){
                        temp_courses.push(course);
                        allCourses.push(course);
                    }
                }
            }
            let temp_description: string = "";
            if (key == "Remaining"){
                temp_description = pathways[pathwayName]["remaining_header"];
            } else{
                if (key == "Required"){
                    temp_description = "Take all of the following courses:";
                } else {
                    temp_description = "Choose one of the following courses:";
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
                name: key,
                numCourses: num,
                description: temp_description,
                courses: temp_courses
            };
            schema.push(cluster);
        }
    }

    let res: IPathwayDescriptionSchema = {
        description: description,
        compatibleMinor: pathways[pathwayName]["minor"],
        courses: allCourses,
        clusters: schema
    };
    console.log(res);
    return NextResponse.json(res);
}
