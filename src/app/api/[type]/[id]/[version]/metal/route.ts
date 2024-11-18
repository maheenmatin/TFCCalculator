import {SmeltingOutput} from "@/types";
import {NextResponse} from "next/server";
import metalsJson from "@/data/metals.json";


export async function GET() {
	const metals : SmeltingOutput[] = metalsJson.metals.map(m => ({
		name : m.name,
		components : [],
		isMineral : true,
		producible : m.producible !== false
	})).filter(mineral => mineral.producible);

	const alloys : SmeltingOutput[] = metalsJson.alloys.map(a => ({
		name : a.name,
		components : a.components,
		isMineral : false
	}));

	return NextResponse.json([...alloys, ...metals]);
}
