import { NextResponse } from "next/server";
import { getCategoriesData } from "@/lib/data";

export async function GET() {
  const categories = await getCategoriesData();
  return NextResponse.json(categories);
}
