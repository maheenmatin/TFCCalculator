import {GameVersions, RouteParams} from "@/types/gameversions";
import path from "path";
import {promises as fs} from "fs";
import {Mineral, SmeltingOutput} from "@/types";
import {DataServiceError} from "@/services/data/dataMapperService";


// TODO: Look into making outputs.json more streamlined to prevent double the work in a lot of these cases
interface OutputJSON {
	metals : SmeltingOutput[];
	alloys : SmeltingOutput[];
}

interface MineralsJSON {
	[outputName: string]: Mineral[];
}

export interface IDataReaderService {
	getGameVersionsJSON() : Promise<GameVersions>;
	getOutputsJSON(params : RouteParams) : Promise<OutputJSON>;
	getMineralsJSON(params : RouteParams) : Promise<MineralsJSON>
}

export class DataReaderService implements IDataReaderService {
	private static readonly MAIN_PATH = path.join(process.cwd(), "src", "data");
	private static readonly READ_OPTIONS = "utf-8";

	private static readonly GAME_VERSIONS_FILE_NAME : string = "gameversions.json";
	private static readonly OUTPUT_FILE_NAME : string = "outputs.json";
	private static readonly MINERALS_FILE_NAME : string = "minerals.json";


	async getGameVersionsJSON() : Promise<GameVersions> {
		const filePath = path.join(
				DataReaderService.MAIN_PATH,
				DataReaderService.GAME_VERSIONS_FILE_NAME
		);

		return this.safeReadJSON<GameVersions>(
      filePath,
      "Game version data"
		);
	}

	async getOutputsJSON(params : RouteParams) : Promise<OutputJSON> {
		const filePath = path.join(
				DataReaderService.MAIN_PATH,
				params.type,
				params.id,
				params.version,
				DataReaderService.OUTPUT_FILE_NAME
		);

		return this.safeReadJSON<OutputJSON>(
      filePath,
      `Output data for ${params.type}/${params.id}/${params.version}`
		);
	}

	async getMineralsJSON(params : RouteParams) : Promise<MineralsJSON> {
		const filePath = path.join(
				DataReaderService.MAIN_PATH,
				params.type,
				params.id,
				params.version,
				DataReaderService.MINERALS_FILE_NAME
		);

		return this.safeReadJSON<MineralsJSON>(
      filePath,
      `Mineral data for ${params.type}/${params.id}/${params.version}`
		);
	}

	private async safeReadJSON<T>(
			filePath : string,
			context : string,
	) : Promise<T> {
		try {
      return await fs.readFile(filePath, DataReaderService.READ_OPTIONS).then(JSON.parse);
		} catch (error) {
			// Not found FS error
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
				throw new DataServiceError(
						404,
						`${context} not found`,
						error
				);
			}

			// JSON syntax
			if (error instanceof SyntaxError) {
				throw new DataServiceError(
						500,
						`Invalid JSON in ${context.toLowerCase()}`,
						error
				);
			}

			// Misc
			throw new DataServiceError(
					500,
					`Failed to read ${context.toLowerCase()}`,
					error
			);
		}
	}
}
