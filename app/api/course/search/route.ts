import { NextResponse, NextRequest } from "next/server";
import { ICourseSchema, IPrereqSchema, ISingleYearOfferedSchema } from "@/public/data/dataInterface";
import path from "path";
import fs from "fs";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  // Fetch the course description and prerequisites data
  // const courseDescriptions = await (
  //   await fetch("https://raw.githubusercontent.com/quatalog/data/master/catalog.json")
  // ).json();

  // const courseAttributes = await (
  //   await fetch("https://raw.githubusercontent.com/quatalog/data/master/prerequisites.json")
  // ).json();

  // // Combine both datasets
  // const combinedData = Object.entries(courseAttributes).map(([code, attributes]) => ({
  //   title: courseDescriptions[code]?.name || "Unknown Course",
  //   courseCode: code,
  //   tag: attributes.attributes || [],
  //   description: courseDescriptions[code]?.description || "No description available",
  //   prereqs: attributes?.prerequisites || false,
  //   semester: 
  // }));

  // console.log(combinedData);
  // return NextResponse.json(combinedData);

  // Fetch local course JSON
  let catalogYear: string = "";
  if (!params.has("catalogYear")) {
    return NextResponse.error();
  }else{
    catalogYear = params.get("catalogYear");
  }
  const courseData = path.join(process.cwd(), "json") + `/${catalogYear}` + "/courses.json"
  const courses = JSON.parse(fs.readFileSync(courseData, "utf8"));
  const transformedData: ICourseSchema[] = [];
  for (let course of Object.keys(courses)) {
    let yearToInsert: ISingleYearOfferedSchema = {
      year: catalogYear,
      fall: courses[course]["offered"]["fall"],
      spring: courses[course]["offered"]["spring"],
      summer: courses[course]["offered"]["summer"],
    };
    transformedData.push({
      title: course,
      courseCode: courses[course]["ID"],
      filter: "",
      description: courses[course]["description"],
      subject: courses[course]["subj"],
      status: "No Selection",
      prereqs: {
        courses: courses[course]["prerequisites"],
        raw_precoreqs: courses[course]["rawprecoreqs"] || "No Prerequisites",
      },
      term: {
        years: [yearToInsert],
        uia: courses[course]["offered"]["uia"],
        text: courses[course]["offered"]["text"],
      },
      attributes: {
        HI: courses[course]["properties"]["HI"],
        CI: courses[course]["properties"]["CI"],
        major_restricted: courses[course]["properties"]["major_restricted"],
      },
    });
  }

  return NextResponse.json(transformedData);
}
