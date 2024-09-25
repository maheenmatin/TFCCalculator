import { Alloy } from "@/app/types";
import { NextResponse } from "next/server";
import alloys from "@/app/data/alloys.json";

export async function GET() {
	return NextResponse.json((alloys as { alloys: Alloy[] }).alloys);
}
