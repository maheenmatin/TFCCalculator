export interface AlloyComponent {
	mineral : string;
	hasIngot? : boolean;
	hasNugget? : boolean;
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
	produces : string;
	yield : number;
	uses? : MineralUse[];
}
