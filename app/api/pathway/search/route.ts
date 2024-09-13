import { NextResponse, NextRequest } from "next/server";
import { IPathwaySchema } from "@/public/data/dataInterface";
import { pathwayDepartment } from "@/public/data/staticData"; 
import * as fs from "fs";
import cors from "cors";
import path from "path";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const catalogYear = params.get("catalogYear");
  console.log(params);

  console.log(1);

  const pathways = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "json") + `/${catalogYear}` + "/pathways.json",
      "utf8"
    )
  );

  console.log(2);
  let blob = pathways;
  console.log(blob.Economics);
  let flatten: any = {};
  for (var [name, v] of Object.entries(blob)) {
    let coursesIn = [];
    let department = "";
    for (var [k, c] of Object.entries(v)) {
      console.log(c);
      if (typeof c === "object" && k != "minor") {
        for (var [title, code] of Object.entries(c)) {
          coursesIn.push(code);
        }
      }
    }
    for (var [key, value] of Object.entries(pathwayDepartment)) {
      if (value.pathway == name){
        department = value.department;
        break;
      }
    }
    flatten[name] = {
      name: name,
      courses: coursesIn,
      department: department,
    };
  }
  const searchString = params.get("searchString");
  if (searchString) {
    flatten = Object.fromEntries(
      Object.entries(flatten).filter(([k, v]) =>
        v["name"].toLowerCase().includes(searchString.toLowerCase())
      )
    );
  }
  console.log(flatten);

  console.log(8);
  // Convert Blob to array
  const output: Array<IPathwaySchema> = Object.entries(flatten).map((v) => {
    const data = v[1];
    return {
      title: data.name,
      coursesIn: data.courses,
      department: data.department,
    };
  });

  console.log("return");
  console.log(output);
  
  return NextResponse.json(output);
}
