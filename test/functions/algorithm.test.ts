import {calculateMetal, MineralWithQuantity} from "@/functions/algorithm";
import {SmeltingOutput, Mineral} from "@/types";


const smallTinVariant : Mineral = { name: 'small tin variant', produces: 'tin', yield: 16 };
const mediumCopperVariant : Mineral = { name: 'medium copper variant', produces: 'copper', yield: 24 };
const largeCopperVariant : Mineral = { name: 'large copper variant', produces: 'copper', yield: 36 };

describe('calculateMetal algorithm', () => {
	const bronzeMetal: SmeltingOutput = {
		name: 'Bronze',
		components: [
			{
				mineral: 'tin',
				min: 8,
				max: 12,
			},
			{
				mineral: 'copper',
				min: 88,
				max: 92,
			},
		],
	};

	it('should return success when exact minerals', () => {
		const availableMinerals: MineralWithQuantity[] = [
			{mineral: smallTinVariant, quantity: 3},
			{mineral: mediumCopperVariant, quantity: 7},
			{mineral: largeCopperVariant, quantity: 6}
		];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(true);
		expect(result.outputMb).toBe(432);
		expect(result.usedMinerals).toEqual(
				expect.arrayContaining(
						availableMinerals.map(expect.objectContaining)
				)
		);
		expect(result.usedMinerals.length).toBe(availableMinerals.length);
	});

	it('should return success when more than enough minerals available', () => {
		const availableMinerals: MineralWithQuantity[] = [
			{mineral: smallTinVariant, quantity: 50},
			{mineral: mediumCopperVariant, quantity: 70},
			{mineral: largeCopperVariant, quantity: 60}
		];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(true);
		expect(result.outputMb).toBe(432);
		expect(result.usedMinerals.find(m => m.mineral.produces === 'tin')?.quantity).toBe(3);
	});

	it('should return success when a variety of minerals are available', () => {
		const availableMinerals: MineralWithQuantity[] = [
			// Required minerals
			{mineral: smallTinVariant, quantity: 3},
			{mineral: mediumCopperVariant, quantity: 7},
			{mineral: largeCopperVariant, quantity: 6},

			// Misc variety
			{mineral: {name: 'large tin variant', produces: 'tin', yield: 48}, quantity: 3},
			{mineral: {name: 'very large tin variant', produces: 'tin', yield: 72}, quantity: 7},
			{mineral: {name: 'very large copper variant', produces: 'copper', yield: 72}, quantity: 8},
			{mineral: {name: 'medium-large copper variant', produces: 'copper', yield: 48}, quantity: 6},
		];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(true);
		expect(result.outputMb).toBe(432);
	})

	it('should return success when unused minerals are availabe', () => {
		const availableMinerals: MineralWithQuantity[] = [
			// Required minerals
			{mineral: smallTinVariant, quantity: 3},
			{mineral: mediumCopperVariant, quantity: 7},
			{mineral: largeCopperVariant, quantity: 6},

			// Misc minerals
			{mineral: {name: 'small iron variant', produces: 'iron', yield: 24}, quantity: 3},
			{mineral: {name: 'silver variant', produces: 'silver', yield: 36}, quantity: 2},
			{mineral: {name: 'large lead variant', produces: 'lead', yield: 48}, quantity: 3},
		];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(true);
		expect(result.outputMb).toBe(432);
	})

	it('should return fail when no minerals provided', () => {
		const availableMinerals: MineralWithQuantity[] = [];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(false);
		expect(result.message).toContain('Not enough total material available');
	});

	it('should return fail when not enough minerals', () => {
		const availableMinerals: MineralWithQuantity[] = [
			{mineral: smallTinVariant, quantity: 2},
			{mineral: mediumCopperVariant, quantity: 7},
			{mineral: largeCopperVariant, quantity: 6}
		];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(false);
		expect(result.message).toContain('Not enough total material available');
	});

	it('should return fail when not enough total component minerals', () => {
		const availableMinerals: MineralWithQuantity[] = [
			{mineral: smallTinVariant, quantity: 32},
			{mineral: mediumCopperVariant, quantity: 2},
			{mineral: largeCopperVariant, quantity: 2}
		];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(false);
		expect(result.message).toContain('Not enough copper for minimum requirement');
	});

	it('should return fail when component has no minerals', () => {
		const availableMinerals: MineralWithQuantity[] = [
			{mineral: mediumCopperVariant, quantity: 8},
			{mineral: largeCopperVariant, quantity: 8}
		];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(false);
		expect(result.message).toContain('Not enough tin for minimum requirement');
	});

	it('should return fail when enough total minerals but impossible ratio constraints', () => {
		// This combination can't work because you can't achieve the correct ratio
		const availableMinerals: MineralWithQuantity[] = [
			{
				mineral: { name: 'large tin variant', produces: 'tin', yield: 48 },
				quantity: 4
			},
			{
				mineral: { name: 'large copper variant', produces: 'copper', yield: 72 },
				quantity: 6
			}
		];

		const result = calculateMetal(432, bronzeMetal, availableMinerals);

		expect(result.success).toBe(false);
		expect(result.message).toContain('Could not find valid combination of materials');
	});
});
