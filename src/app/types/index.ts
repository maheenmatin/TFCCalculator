export interface AlloyComponent {
	mineral : string;
	min : number;
	max : number;
}

export interface Alloy {
	name : string;
	components : AlloyComponent[];
}

export enum MineralUse {
	Vessel = "vessel",
	Crucible = "crucible",
	Bloomery = "bloomery",
	BlastFurnace = "blast_furnace"
}

export interface Mineral {
	name : string;
	yield : number;
	uses? : MineralUse[];
}
