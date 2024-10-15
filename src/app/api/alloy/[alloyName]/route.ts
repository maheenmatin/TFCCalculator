import { Alloy } from "@/app/types";
import { NextResponse } from "next/server";
import alloys from "@/app/data/alloys.json";

export async function GET(
		_ : Request,
		{ params }: { params: { alloyName: string } }) {
	const alloyName = params.alloyName;

	const alloyData = (alloys as { alloys: Alloy[] }).alloys.find(
			(alloy) => alloy.name.toLowerCase() === decodeURIComponent(alloyName).toLowerCase()
	);

	if (!alloyData) {
		return NextResponse.json({ error: "Alloy not found" }, { status: 404 });
	}

	return NextResponse.json(alloyData);
}
