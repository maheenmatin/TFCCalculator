import {NextResponse} from "next/server";
import gameVersionJson from "@/data/gameversions.json";
import {GameVersions} from "@/types/gameversions";


export async function GET() {
	const data = gameVersionJson as GameVersions;

	// Filter out unsupported items
	const filtered = {
		modpack : data.modpack.filter(item => item.supported),
		mod : data.mod.filter(item => item.supported),
		lastUpdated : data.lastUpdated,
		version : data.version,
		schemaVersion : data.schemaVersion
	};

	return NextResponse.json(filtered);
}