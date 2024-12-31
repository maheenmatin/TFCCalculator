import {NextResponse} from "next/server";
import {RouteParams, VersionType} from "@/types/gameversions";
import {getDataService} from "@/services/data/dataService";


interface RouteContext {
	params : {
		type : VersionType;
		id : string;
		version : string;
	};
}

export async function GET(
		_ : Request,
		context : RouteContext
) {
	const {type, id, version} = context.params;

	try {
		const routeParams : RouteParams = {type, id, version};
		const dataService = await getDataService(routeParams);
		return NextResponse.json(await dataService.getOutputs());
	} catch (error) {
		if (error
				&& typeof error === "object"
				&& "status" in error
				&& "message" in error
		) {
			return NextResponse.json(
				{message : error.message as string},
				{status : error.status as number}
			);
		}

		console.error(`Failed to fetch metals data: ${error}`);
		return NextResponse.json(
				{error : "Failed to fetch metals data"},
				{status : 500}
		);
	}
}