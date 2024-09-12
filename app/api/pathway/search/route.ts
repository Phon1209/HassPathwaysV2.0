import { NextResponse, NextRequest } from "next/server";
import { IPathwaySchema } from "@/public/data/dataInterface";
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

  const departmentString = params.get("department");
  if (departmentString) {
    const departments = departmentString.split(",");
    blob = blob.filter((c) => departments.includes(c["department"]));
  }
  let flatten = blob.flatMap((dep) => {
    return dep.pathways.map((path) => {
      return {
        name: path.name,
        clusters: path.clusters,
        department: dep.department,
        required: path.required,
      };
    });
  });
  //   blob = blob.map((c) => c["pathways"]).flat();

  console.log(3);
  for (var [k, c] of Object.entries(flatten)) {
    c["courses"] = c["clusters"]
      .map((b) => b["courses"])
      .flat()
      .concat(c["required"] != null ? c["required"] : []);
  }
  flatten = Object.fromEntries(
    Object.entries(flatten).filter(([k, v]) => k != "clusters")
  );

  const searchString = params.get("searchString");
  if (searchString) {
    flatten = Object.fromEntries(
      Object.entries(flatten).filter(([k, v]) =>
        v["name"].toLowerCase().includes(searchString.toLowerCase())
      )
    );
  }

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
