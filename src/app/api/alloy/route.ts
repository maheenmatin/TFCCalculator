import { Alloy } from "@/types";
import { NextResponse } from "next/server";
import alloys from "@/data/alloys.json";

export async function GET() {
	return NextResponse.json((alloys as { alloys: Alloy[] }).alloys);
}
