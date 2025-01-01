export interface SmeltingOutput {
	name : string;
	components : SmeltingComponent[];
	producible? : boolean;
	type : SmeltingOutputType;
}

enum SmeltingOutputType {
	METAL,
	ALLOY
}

export interface MetalOutput extends SmeltingOutput {
	type : SmeltingOutputType.METAL
}

export interface AlloyOutput extends SmeltingOutput {
	type : SmeltingOutputType.ALLOY
}

/**
 * Guard function to determine if SmeltingOutput is an Alloy
 * @param output
 */
export function isAlloyOutput(output: SmeltingOutput): output is AlloyOutput {
	return output.type === SmeltingOutputType.ALLOY;
}

export interface SmeltingComponent {
	mineral : string;
	min : number;
	max : number;
	default? : SmeltingComponentDefaultOption[];
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
