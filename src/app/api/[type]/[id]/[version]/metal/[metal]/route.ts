import {InputMineral, MineralUseCase} from "@/types";
import {NextResponse} from "next/server";
import {RouteParams} from "@/types/gameversions";
import {getDataService} from "@/services/data/dataService";


interface RouteContext {
	params : RouteParams & {
		metal : string;
	};
}

export async function GET(
		request : Request,
		{params} : RouteContext
) {
	const {metal, type, id, version} = params;
	const {searchParams} = new URL(request.url);
	const uses = searchParams.getAll("uses").map(use => use as MineralUseCase);
	const decodedMetal = decodeURIComponent(metal).toLowerCase();

	try {
		const dataService = await getDataService({type, id, version});
		const metalResponse = await dataService.getOutput(decodedMetal);

		const filteredMinerals = filterMineralsByUses(metalResponse.minerals, uses);
		const mineralsObject = Object.fromEntries(filteredMinerals);

		return NextResponse.json(
				{
					material : metalResponse.material,
					minerals : mineralsObject
				});
	} catch (error) {
		console.error(`Failed to fetch metal for ${decodedMetal}: ${error}`);
		return NextResponse.json(
				{
					error : `Failed to fetch metal for ${decodedMetal}`,
					raw_error : error
				},
				{status : 500}
		);
	}
}

/**
 * Filters minerals based on their use cases using non-exclusive OR.
 * Returns true if no uses are specified or if the mineral has any of the specified uses.
 * @param minerals The map of InputMinerals to filter
 * @param uses Array of MineralUseCase to filter by
 * @returns Filtered array of InputMinerals
 */
function filterMineralsByUses(minerals : Map<string, InputMineral[]>, uses : MineralUseCase[]) : Map<string, InputMineral[]> {
	if (uses.length === 0) {
		return minerals;
	}

	minerals.forEach((component, key) => {
		minerals.set(key, component.filter(mineral => uses.some(use => mineral.uses?.includes(use))));
	});

	return minerals;
}