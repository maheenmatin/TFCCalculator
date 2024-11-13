import {SmeltingOutput, InputMineral, MineralUseCase} from "@/types";
import {NextResponse} from "next/server";
import alloysJson from "@/data/alloys.json";
import mineralsJson from "@/data/minerals.json";

// TODO: Restrcture JSON file to be reusable for different versions.
// TODO: Use the JSON file to pull out specific information.
export async function GET(
		request : Request,
		{params} : { params : { alloyName : string } }
) {
	const {alloyName} = params;
	const {searchParams} = new URL(request.url);
	const uses = searchParams.getAll("uses");

	const alloyList = alloysJson.alloys as SmeltingOutput[];
	const alloy = alloyList.find(
			(a) => a.name.toLowerCase() === decodeURIComponent(alloyName).toLowerCase()
	);

	if (!alloy) {
		return NextResponse.json({message : "Alloy not found"}, {status : 404});
	}

	const alloyMinerals = alloy.components.flatMap((component) => {
		const rawMinerals = mineralsJson[component.mineral as keyof typeof mineralsJson];

		if (!rawMinerals) {
			return null;
		}

		const mineralsWithProduces : InputMineral[] = rawMinerals.map((mineral) => ({
			...mineral,
			produces : component.mineral,
			uses : mineral.uses ? toMineralUses(mineral.uses) : undefined
		}));

		return mineralsWithProduces.filter((mineral) => {
			if (uses.length === 0) {
				return true;
			}

			return uses.some((use) => mineral.uses?.includes(use as MineralUseCase));
		});
	}).filter((m) : m is NonNullable<typeof m> => m !== null);

	const response = {
		alloy : {
			name : alloy.name,
			components : alloy.components
		},
		minerals : alloyMinerals
	};

	return NextResponse.json(response);
}

/**
 * Utility function to convert string mineral uses to enums.
 * @param uses array of mineral uses as strings.
 */
function toMineralUses(uses : string[]) : MineralUseCase[] {
	const validUses = Object.values(MineralUseCase) as string[];
	return uses
			.filter((use) => validUses.includes(use))
			.map((use) => use as MineralUseCase);
}
