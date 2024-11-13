export interface Component {
	mineral : string;
	hasIngot? : boolean;
	hasNugget? : boolean;
	min : number;
	max : number;
}

export interface Alloy {
	name : string;
	components : Component[];
	producible? : boolean;
}

export enum MineralUse {
	Vessel = "vessel",
	Crucible = "crucible",
	Bloomery = "bloomery",
	BlastFurnace = "blast_furnace"
}

export interface RawMineral {
	name : string;
	produces : string;
	yield : number;
	uses? : MineralUse[];
}
