import {Alloy} from "@/app/types";
import {NextResponse} from "next/server";
import alloys from "@/app/data/alloys.json";


export async function GET(request : Request) {
	const {searchParams} = new URL(request.url);
	const alloyName = searchParams.get("name");

	// Return the list of all alloys
	if (!alloyName) {
		return NextResponse.json((alloys as { alloys : Alloy[] }).alloys);
	}

	// Return details for a specific alloy
	const alloyData = (alloys as { alloys : Alloy[] }).alloys.find(
			(alloy) => alloy.name.toLowerCase() === decodeURIComponent(alloyName).toLowerCase()
	);

	if (!alloyData) {
		return NextResponse.json({error : "Alloy not found"}, {status : 404});
	}

	return NextResponse.json(alloyData);
}