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
		if (dataService instanceof NextResponse) {
			return dataService;
		}

		const metalResponse = await dataService.getMetal(decodedMetal);

		const filteredMinerals = filterMineralsByUses(metalResponse.minerals, uses);

		return NextResponse.json(
				{
					material : metalResponse.material,
					minerals : filteredMinerals
				});
	} catch (error) {
		if (error && typeof error === 'object' && 'statusCode' in error) {
			return NextResponse.json(
					{message : "Material not found"},
					{status : error.statusCode as number}
			);
		}

		console.error(`Failed to fetch metal data for ${decodedMetal}:`, error);
		return NextResponse.json(
				{error : "Failed to fetch metal data"},
				{status : 500}
		);
	}
}

/**
 * Filters minerals based on their use cases using non-exclusive OR.
 * Returns true if no uses are specified or if the mineral has any of the specified uses.
 * @param minerals The array of InputMinerals to filter
 * @param uses Array of MineralUseCase to filter by
 * @returns Filtered array of InputMinerals
 */
function filterMineralsByUses(minerals : InputMineral[], uses : MineralUseCase[]) : InputMineral[] {
	if (uses.length === 0) {
		return minerals;
	}

	return minerals.filter(mineral => uses.some(use => mineral.uses?.includes(use)));
}