import { NextResponse, NextRequest } from "next/server";
import { ICourseDescriptionSchema, IPrereqSchema, IPropertiesSchema, IOfferedSchema } from "@/public/data/dataInterface";
import path from "path";
import * as fs from "fs";

// Define interfaces for your data structures

interface WhenOffered {
  even: boolean;
  odd: boolean;
  fall: boolean;
  spring: boolean;
  summer: boolean;
  uia: boolean;
  text: string;
}

// Main GET function
export async function GET(request: NextRequest) {
  const pathParts = request.nextUrl.pathname.split("/");
  const selectedCourseCode = pathParts[pathParts.length - 1].toUpperCase();
  let subjLooking = selectedCourseCode.split("-")[0];
  let idLooking = selectedCourseCode.split("-")[1];
  const jsonCourse = path.join(process.cwd(), "json") + `/2023-2024` + "/courses.json"
  const courseData: Object = JSON.parse(fs.readFileSync(jsonCourse, "utf8"));
  // Fetch data from external sources
  let response: ICourseDescriptionSchema = {
    title : "Course not found",
    description: "des not found",
    prereqs: undefined,
    attributes: undefined,
    term: undefined,
  };

  for (let [k, v] of Object.entries(courseData)) {
    if (subjLooking === v.subj && idLooking === v.ID) {
      console.log(v);
      let prereq_inserting: IPrereqSchema = {
        type: "and",
        nested: v.prerequisites.map((prereq) => {
            let t: IPrereqSchema = {
              type: "course",
              course: prereq,
            };
            return t;}),
          };
      let whenOffered = v.offered;
      let properties: IPropertiesSchema = {
        HI: v.properties.HI,
        CI: v.properties.CI,
        major_restricted: v.properties.major_restricted,
      };
      let courseSemester: IOfferedSchema = {
        even: whenOffered.even,
        odd: whenOffered.odd,
        fall: whenOffered.fall,
        spring: whenOffered.spring,
        summer: whenOffered.summer,
        uia: whenOffered.uia,
        text: whenOffered.text,
      };
      response = {
        title: v.name,
        description: v.description,
        prereqs: prereq_inserting,
        attributes: properties,
        term: courseSemester,
      };
      break;
    }
  }

  // Construct the combined course data
  console.log(response);
  // Return the response
  return NextResponse.json(response);
}
