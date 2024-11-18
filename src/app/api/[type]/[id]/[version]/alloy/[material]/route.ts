import {SmeltingOutput, InputMineral, MineralUseCase} from "@/types";
import {NextResponse} from "next/server";
import alloysJson from "@/data/alloys.json";
import mineralsJson from "@/data/minerals.json";

// TODO: Restrcture JSON file to be reusable for different versions.
// TODO: Use the JSON file to pull out specific information.
export async function GET(
		request : Request,
		{params} : { params : { material : string } }
) {
	const {material} = params;
	const {searchParams} = new URL(request.url);
	const uses = searchParams.getAll("uses").map(use => use as MineralUseCase);
	const decodedMaterial = decodeURIComponent(material).toLowerCase();

	const mineralData = findMineralData(decodedMaterial);
	if (mineralData) {
		return handleMineralResponse(mineralData, uses);
	}

	const alloyData = findAlloyData(decodedMaterial);
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
function findMineralData(name : string) {
	return alloysJson.minerals.find(m => m.name.toLowerCase() === name);
}

/**
 * Searches for an alloy by its name in the alloys data.
 * @param name The lowercase name of the alloy to find.
 * @returns The alloy data if found, undefined otherwise.
 */
function findAlloyData(name : string) {
	return alloysJson.alloys.find(a => a.name.toLowerCase() === name);
}

/**
 * Processes and formats the response for a mineral request.
 * Creates a SmeltingOutput with 100% concentration of the mineral.
 * @param mineralData The raw mineral data from the JSON file.
 * @param uses Array of MineralUseCase to filter by.
 * @returns NextResponse containing formatted mineral data and associated minerals.
 */
function handleMineralResponse(mineralData : typeof alloysJson.minerals[0], uses : MineralUseCase[]) {
	const mineral : SmeltingOutput = {
		name : mineralData.name,
		components : [
			{
				mineral : mineralData.name,
				min : 100,
				max : 100
			}
		],
		isMineral : true
	};

	const inputMinerals = getMineralsForComponent(mineralData.name, uses);

	return NextResponse.json(
			{
				material : mineral,
				minerals : inputMinerals
			}
	);
}

/**
 * Processes and formats the response for an alloy request.
 * Maps component minerals and applies use case filtering.
 * @param alloy The raw alloy data from the JSON file.
 * @param uses Array of MineralUseCase to filter by.
 * @returns NextResponse containing formatted alloy data and associated minerals.
 */
function handleAlloyResponse(alloy : typeof alloysJson.alloys[0], uses : MineralUseCase[]) {
	const alloyMinerals = alloy.components.flatMap(
			component => getMineralsForComponent(component.mineral, uses))
	                           .filter((m) : m is NonNullable<typeof m> => m !== null);

	return NextResponse.json(
			{
				material : {
					name : alloy.name,
					components : alloy.components,
					isMineral : false
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
	if (!rawMinerals) {
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
