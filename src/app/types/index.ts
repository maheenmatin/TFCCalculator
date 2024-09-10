export interface AlloyComponent {
	metal: string;
	min: number;
	max: number;
}

export interface Alloy {
	name: string;
	components: AlloyComponent[];
	yield: number;
}
