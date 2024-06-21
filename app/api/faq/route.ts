import { NextResponse } from "next/server";
import faq from "./faq.json";
import { IFAQ } from "@/public/data/dataInterface";
import { connectToDataBase } from "@db/database";

export async function GET() {
  return NextResponse.json(faq);
}
