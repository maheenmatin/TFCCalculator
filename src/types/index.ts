export interface SmeltingOutput {
	name : string;
	components : SmeltingComponent[];
	isMetal : boolean;
	producible? : boolean;
}

export interface SmeltingComponent {
	mineral : string;
	min : number;
	max : number;
	default : SmeltingComponentDefaultOption[];

}

export enum SmeltingComponentDefaultOption {
	BLOCK = "block",
	INGOT = "ingot",
	NUGGET = "nugget",

	ROD = "rod",
}

export interface InputMineral {
	name : string;
	produces : string;
	yield : number;
	uses? : MineralUseCase[];
}

export enum MineralUseCase {
	Vessel = "vessel",
	Crucible = "crucible",
	Bloomery = "bloomery",
	BlastFurnace = "blast_furnace"
}

export enum DesiredOutputTypes {
	Ingot,
	Nugget,
	Millibucket
}
