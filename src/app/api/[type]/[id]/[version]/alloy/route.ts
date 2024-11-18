import {SmeltingOutput} from "@/types";
import {NextResponse} from "next/server";
import data from "@/data/alloys.json";


export async function GET() {
	const minerals : SmeltingOutput[] = data.minerals.map(mineral => ({
		name : mineral.name,
		components : [],
		isMineral : true,
		producible : mineral.producible !== false
	})).filter(mineral => mineral.producible);

	const alloys : SmeltingOutput[] = data.alloys.map(alloy => ({
		name : alloy.name,
		components : alloy.components,
		isMineral : false
	}));

	return NextResponse.json([...minerals, ...alloys]);
}
