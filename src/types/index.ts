export interface SmeltingOutput {
	name : string;
	components : SmeltingComponent[];
	isMineral? : boolean;
	producible? : boolean;
}

export interface SmeltingComponent {
	mineral : string;
	hasIngot? : boolean;
	hasNugget? : boolean;
	min : number;
	max : number;
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
