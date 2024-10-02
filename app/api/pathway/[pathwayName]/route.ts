import { IPathwayDescriptionSchema } from "@/public/data/dataInterface";
import { NextRequest, NextResponse } from "next/server";
import { ICourseClusterSchema, ICourseSchema } from "@/public/data/dataInterface";
import * as fs from "fs";
import path from "path";

type PathwayRequest = {
  params: {
    pathwayName: string;
  };
};

export async function GET(request: NextRequest, data: PathwayRequest) {
    const searchParams  = request.nextUrl.searchParams;
    const catalogYear = searchParams.get("catalogYear");
    const pathways = JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "json") + `/${catalogYear}` + "/pathways.json",
          "utf8"
        )
    );
    const { pathwayName } = data.params;

    let schema: Array<ICourseClusterSchema> = [];

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
                let split_code: string[] = full_code.split(" ");
                let courseSchema: ICourseSchema = {
                    title: course_name,
                    courseCode: split_code[1],
                    subject: split_code[0],
                    attributes: {
                        HI: false,
                        CI: false,
                        major_restricted: false
                    },
                    filter: "",
                    description: "",
                    status: "No Selection"
                };
                temp_courses.push(courseSchema);
            }
            let temp_description: string = "";
            if (key == "Remaining"){
                temp_description = pathways[pathwayName]["remaining_header"];
            }
            let cluster: ICourseClusterSchema = {
                name: key,
                description: temp_description,
                courses: temp_courses
            };
            schema.push(cluster);
        }
    }

    let res: IPathwayDescriptionSchema = {
        description: description,
        compatibleMinor: pathways[pathwayName]["minor"],
        courses: schema
    };

    return NextResponse.json(res);
}
