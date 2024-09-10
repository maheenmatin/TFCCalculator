import alloys from "@/app/data/alloys.json"
import {Alloy} from "@/app/types";
import { NextResponse } from 'next/server';


export async function GET() {
	const alloyData: { alloys: Alloy[] } = alloys;
	return NextResponse.json(alloyData.alloys);
}