import { NextResponse, NextRequest } from "next/server";
import { ICourseSchema, IPrereqSchema, IPropertiesSchema, IOfferedSchema, ISingleYearOfferedSchema } from "@/public/data/dataInterface";
import { catalogList } from "@/public/data/staticData";
import path from "path";
import * as fs from "fs";
import { template } from "lodash";

// Main GET function
export async function GET(request: NextRequest) {
  const pathParts = request.nextUrl.pathname.split("/");
  const selectedCourseCode = pathParts[pathParts.length - 1].toUpperCase();
  let subjLooking = selectedCourseCode.split("-")[0];
  let idLooking = selectedCourseCode.split("-")[1];
  const allData: Object[] = [];
  for (let year of catalogList) {
    const jsonYear = path.join(process.cwd(), "json") + `/${year.text}` + "/courses.json";
    let yearData = JSON.parse(fs.readFileSync(jsonYear, "utf8"));
    yearData.year = year.text;
    allData.push(yearData);
  }
  let response: ICourseSchema = {
    title : "Course not found",
    description: "des not found",
    filter: "",
    subject: subjLooking,
    courseCode: idLooking,
    prereqs: undefined,
    attributes: {
      CI: false,
      HI: false,
      major_restricted: false,
    },
    term: undefined,
    status: "No Selection",
  };
  let courseData = allData[allData.length - 1];

  for (let [k, v] of Object.entries(courseData)) {
    if (subjLooking === v.subj && idLooking === v.ID) {
      let prereq_inserting: IPrereqSchema = {
        raw_precoreqs: v.rawprecoreqs,
        courses: v.prerequisites,
      };
      let whenOffered = v.offered;
      let properties: IPropertiesSchema = {
        HI: v.properties.HI,
        CI: v.properties.CI,
        major_restricted: v.properties.major_restricted,
      };
      let offered_years: ISingleYearOfferedSchema[] = [];
      for (let yearData of allData) {
        for (let [i, j] of Object.entries(yearData)) {
          if (j.subj === v.subj && j.ID === v.ID) {
            offered_years.push({
              year: yearData.year,
              fall: j.offered.fall,
              spring: j.offered.spring,
              summer: j.offered.summer,
            });
          }
        }
      }
      let courseSemester: IOfferedSchema = {
        years: offered_years,
        uia: whenOffered.uia,
        text: whenOffered.text,
      };
      response = {
        title: v.name,
        courseCode: v.ID,
        filter: "",
        subject: v.subj,
        description: v.description,
        prereqs: prereq_inserting,
        attributes: properties,
        term: courseSemester,
        status: "No Selection",
      };
      break;
    }
  }
  // Return the response
  return NextResponse.json(response);
}
