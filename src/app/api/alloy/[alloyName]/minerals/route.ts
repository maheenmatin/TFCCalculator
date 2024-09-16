import {alloys} from "@/app/data/alloys.json";
import minerals from "@/app/data/minerals.json";
import {Alloy, MineralUse} from "@/app/types";
import {NextResponse} from "next/server";


export async function GET(
		request : Request,
		{params} : { params : { alloyName : string } }
) {
	const {alloyName} = params;
	const {searchParams} = new URL(request.url);
	const uses = searchParams.getAll("uses");

	const alloyList = alloys as Alloy[];
	const alloy = alloyList.find((a) => a.name.toLowerCase() === decodeURIComponent(alloyName).toLowerCase());

	if (!alloy) {
		return NextResponse.json({message : "Alloy not found"}, {status : 404});
	}

	const alloyMinerals = alloy.components.map((component) => {
		const mineral = minerals[component.mineral as keyof typeof minerals];

		if (!mineral) {
			return null;
		}

		const filteredMinerals = mineral.filter((m) => {
			if (uses.length === 0) {
				return true;
			}
			return uses.every((use) => m.uses?.includes(use as MineralUse));
		});

		return {
			name : component.mineral,
			details : filteredMinerals
		};
	}).filter((m) : m is NonNullable<typeof m> => m !== null);

	return NextResponse.json(alloyMinerals);
}
