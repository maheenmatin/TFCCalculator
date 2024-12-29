import {SmeltingOutput, InputMineral, MineralUseCase} from "@/types";
import {NextResponse} from "next/server";
import metalsJson from "@/data/metals.json";
import mineralsJson from "@/data/minerals.json";

// TODO: Restrcture JSON file to be reusable for different versions.
// TODO: Use the JSON file to pull out specific information.
export async function GET(
		request : Request,
		{params} : { params : { metal : string } }
) {
	const {metal} = params;
	const {searchParams} = new URL(request.url);
	const uses = searchParams.getAll("uses").map(use => use as MineralUseCase);
	const decodedMetal = decodeURIComponent(metal).toLowerCase();

	const metalData = findMetalData(decodedMetal);
	if (metalData) {
		return handleMetalResponse(metalData, uses);
	}

	const alloyData = findAlloyData(decodedMetal);
	if (!alloyData) {
		return NextResponse.json(
				{message : "Material not found"},
				{status : 404}
		);
	}

	return handleAlloyResponse(alloyData, uses);
}

/**
 * Searches for a mineral by its name in the minerals data.
 * @param name The lowercase name of the mineral to find.
 * @returns The mineral data if found, undefined otherwise.
 */
function findMetalData(name : string) {
	return metalsJson.metals.find(m => m.name.toLowerCase() === name);
}

/**
 * Searches for an alloy by its name in the alloys data.
 * @param name The lowercase name of the alloy to find.
 * @returns The alloy data if found, undefined otherwise.
 */
function findAlloyData(name : string) {
	return metalsJson.alloys.find(a => a.name.toLowerCase() === name);
}

/**
 * Processes and formats the response for a metal request.
 * Creates a SmeltingOutput with 100% concentration of the metal.
 * @param metalData The raw data from the JSON file.
 * @param uses Array of MineralUseCase to filter by.
 * @returns NextResponse containing formatted metal data and associated minerals.
 */
function handleMetalResponse(metalData : typeof metalsJson.metals[0], uses : MineralUseCase[]) {
	const mineral : SmeltingOutput = {
		name : metalData.name,
		components : [
			{
				mineral : metalData.name,
				min : 100,
				max : 100
			}
		],
		isMineral : true
	};

	const minerals = getMineralsForComponent(metalData.name, uses);

	return NextResponse.json(
			{
				material : mineral,
				minerals
			}
	);
}

/**
 * Processes and formats the response for an alloy request.
 * Maps component minerals and applies use case filtering.
 * @param alloy The raw data from the JSON file.
 * @param uses Array of MineralUseCase to filter by.
 * @returns NextResponse containing formatted alloy data and associated minerals.
 */
function handleAlloyResponse(alloy : typeof metalsJson.alloys[0], uses : MineralUseCase[]) {
	const alloyMinerals = alloy.components.flatMap(
			component => getMineralsForComponent(component.mineral, uses))
	                           .filter((m) : m is NonNullable<typeof m> => m !== null);

	return NextResponse.json(
			{
				material : {
					name : alloy.name,
					components : alloy.components
				},
				minerals : alloyMinerals
			}
	);
}

/**
 * Retrieves and processes minerals for a given component.
 * Applies use case filtering and adds production information.
 * @param mineralName The name of the mineral component.
 * @param uses Array of MineralUseCase to filter by.
 * @returns Array of processed InputMineral objects.
 */
function getMineralsForComponent(mineralName : string, uses : MineralUseCase[]) : InputMineral[] {
	const rawMinerals = mineralsJson[mineralName as keyof typeof mineralsJson];
	if (!rawMinerals || !Array.isArray(rawMinerals)) {
		return [];
	}

	return rawMinerals
			.map(mineral => ({
				...mineral,
				produces : mineralName,
				uses : mineral.uses ? toMineralUses(mineral.uses) : undefined
			}))
			.filter(mineral => filterByUses(mineral, uses));
}

/**
 * Filters minerals based on their use cases using non-exclusive OR.
 * Returns true if no uses are specified or if the mineral has any of the specified uses.
 * @param mineral The InputMineral to check
 * @param uses Array of MineralUseCase to filter by
 * @returns Boolean indicating if the mineral matches the use case filter
 */
function filterByUses(mineral : InputMineral, uses : MineralUseCase[]) : boolean {
	if (uses.length === 0) {
		return true;
	}

	return uses.some(use => mineral.uses?.includes(use));
}

/**
 * Utility function to convert string mineral uses to enums.
 * @param uses array of mineral uses as strings.
 */
function toMineralUses(uses : string[]) : MineralUseCase[] {
	const validUses = Object.values(MineralUseCase) as string[];
	return uses
			.filter(use => validUses.includes(use))
			.map(use => use as MineralUseCase);
}
