import { NextResponse } from "next/server";
import { SmeltingOutput } from "@/types";
import {RouteParams, VersionType} from "@/types/gameversions";
import {getDataService} from "@/services/data/dataService";


interface RouteContext {
	params: {
		type: VersionType;
		id: string;
		version: string;
	}
}

export async function GET(
		_: Request,
		context: RouteContext
) {
	const { type, id, version } = context.params;

	try {
		const routeParams: RouteParams = { type , id, version };
		const dataService = await getDataService(routeParams);
		if (dataService instanceof NextResponse) {
			return dataService;
		}

		const { metals, alloys } = await dataService.getMetals();

		const processedMetals: SmeltingOutput[] = metals
				.map(m => ({
					name: m.name,
					components: [],
					isMineral: true,
					producible: m.producible !== false
				}))
				.filter(mineral => mineral.producible);

		const processedAlloys: SmeltingOutput[] = alloys.map(a => ({
			name: a.name,
			components: a.components,
			isMineral: false
		}));

		return NextResponse.json([...processedAlloys, ...processedMetals]);
	} catch (error) {
		console.error("Failed to fetch metals data:", error);
		return NextResponse.json(
				{ error: "Failed to fetch metals data" },
				{ status: 500 }
		);
	}
}