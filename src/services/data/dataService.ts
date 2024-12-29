import {notFound} from "next/navigation";
import {cache} from "react";
import {RouteParams} from "@/types/gameversions";
import {InputMineral, MineralUseCase, SmeltingOutput} from "@/types";
import {promises as fs} from "fs";
import path from "path";
import {NextResponse} from "next/server";


interface RawMineralData {
	name : string;
	yield : number;
	uses? : MineralUseCase[];
}

interface RawMineralsJson {
	[mineralName : string] : RawMineralData[];
}

export interface MetalResponse {
	material : SmeltingOutput;
	minerals : InputMineral[];
}

export interface MetalsListResponse {
	metals : SmeltingOutput[];
	alloys : SmeltingOutput[];
}

export class DataService {
	private constructor(
			private dataPath : string
	) {}

	static async initialize(params : RouteParams) : Promise<DataService> {
		const dataPath = path.join(process.cwd(), "src", "data", params.type, params.id, params.version);
		return new DataService(dataPath);
	}

	async getMetals() : Promise<MetalsListResponse> {
		try {
			const filePath = path.join(this.dataPath, "metals.json");
			console.log("Reading metals from:", filePath);

			const fileContent = await fs.readFile(filePath, "utf-8");
			return JSON.parse(fileContent);
		} catch (error) {
			console.error(`Failed to load metals from ${this.dataPath}:`, error);
			notFound();
		}
	}

	async getMetal(metalName : string) : Promise<MetalResponse> {
		try {
			const metals = await this.getMetals();

			const smeltingOutput = metals.metals.find(
					(metal : SmeltingOutput) => metal.name.toLowerCase() === metalName.toLowerCase()
			) || metals.alloys.find(
					(alloy : SmeltingOutput) => alloy.name.toLowerCase() === metalName.toLowerCase()
			);

			if (!smeltingOutput) {
				notFound();
			}

			return {
				material : smeltingOutput,
				minerals : await this.getMineralsForMetal(smeltingOutput)
			};
		} catch (error) {
			console.error(`Failed to load metal ${metalName} for ${this.dataPath}:`, error);
			notFound();
		}
	}

	private async getMineralsForMetal(metal : SmeltingOutput) : Promise<InputMineral[]> {
		const minerals = await this.loadMinerals();
		if (!minerals) {
			console.error("Failed to load minerals!");
			notFound();
		}

		return metal.components.flatMap(component => {
			const mineralData = minerals[component.mineral];
			if (!mineralData) {
				return [];
			}

			return mineralData.map(mineral => ({
				...mineral,
				produces : component.mineral
			}));
		});
	}

	private async loadMinerals() : Promise<RawMineralsJson | null> {
		try {
			const filePath = path.join(this.dataPath, "minerals.json");
			const fileContent = await fs.readFile(filePath, "utf-8");
			return JSON.parse(fileContent);
		} catch (error) {
			console.error(`Failed to load minerals from ${this.dataPath}:`, error);
			notFound();
		}
	}
}

export const getDataService =
		cache(async(params : RouteParams) : Promise<DataService | NextResponse<{ error : string }>> => {
			if (!params.type || !params.id || !params.version) {
				return NextResponse.json(
						{error : "Missing required parameters: type, id, and version are required"},
						{status : 400}
				);
			}

			return DataService.initialize(params);
		});
