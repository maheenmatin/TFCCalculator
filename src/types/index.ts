export interface SmeltingComponent {
	mineral : string;
	hasIngot? : boolean;
	hasNugget? : boolean;
	min : number;
	max : number;
}

export interface SmeltingOutput {
	name : string;
	components : SmeltingComponent[];
	producible? : boolean;
}

export enum MineralUseCase {
	Vessel = "vessel",
	Crucible = "crucible",
	Bloomery = "bloomery",
	BlastFurnace = "blast_furnace"
}

export interface InputMineral {
	name : string;
	produces : string;
	yield : number;
	uses? : MineralUseCase[];
}
