import { NextResponse } from "next/server";
import { getSettingsData } from "@/lib/data";

export async function GET() {
  const settings = await getSettingsData();
  return NextResponse.json(settings);
}
