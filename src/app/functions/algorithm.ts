import {Alloy, AlloyComponent, Mineral} from "@/app/types";


export interface MineralWithQuantity {
	mineral: Mineral;
	quantity: number;
}

export interface AlloyProductionResult {
	outputMb: number;
	usedMinerals: MineralWithQuantity[];
	success: boolean;
	message?: string;
}

interface MineralCombination {
	minerals: MineralWithQuantity[];
	outputMb: number;
}

/**
 * Groups minerals by their production type.
 * For example groups all copper producing minerals.
 * @param availableMinerals All available minerals.
 */
function groupMinerals(availableMinerals: MineralWithQuantity[]) : Map<string, MineralWithQuantity[]> {
	const mineralsByType = new Map<string, MineralWithQuantity[]>();

	for (const mineralWithQty of availableMinerals) {
		const producedMineral = mineralWithQty.mineral.produces.toLowerCase();

		if (!mineralsByType.has(producedMineral)) {
			mineralsByType.set(producedMineral, []);
		}

		mineralsByType.get(producedMineral)?.push(mineralWithQty);
	}

	return mineralsByType;
}

/**
 * Calculate the total available mB for each mineral production type.
 * @param mineralsByType Grouped minerals by their production type.
 */
function calculateAvailableMbByType(mineralsByType : Map<string, MineralWithQuantity[]>) : Map<string, number> {
	const totalAvailableByType = new Map<string, number>();

	mineralsByType.forEach((minerals: MineralWithQuantity[], type: string) => {
		const total = minerals.reduce(
				(sum: number, m: MineralWithQuantity): number => sum + (m.mineral.yield * m.quantity), 0
		);

		totalAvailableByType.set(type, total);
	});

	return totalAvailableByType;
}

function findValidCombination(
		targetMb: number,
		components: AlloyComponent[],
		mineralsByType: Map<string, MineralWithQuantity[]>
): MineralWithQuantity[] | null {
	let result: MineralWithQuantity[] = [];
	let totalMb = 0;

	// For each component, try to find a combination that works
	for (const component of components) {
		const mineralType = component.mineral.toLowerCase();
		const minerals = mineralsByType.get(mineralType) || [];
		const minMb = (component.min / 100) * targetMb;
		const maxMb = (component.max / 100) * targetMb;

		// Sort minerals by yield (largest to smallest)
		const sortedMinerals = [...minerals].sort(
				(a, b) => b.mineral.yield - a.mineral.yield
		);

		// Try different valid combinations
		let bestCombination: MineralCombination | null = null;
		let bestDifference = Infinity;

		// Function to try combinations recursively
		function tryCombination(
				index: number,
				currentMinerals: MineralWithQuantity[],
				accumulatedMb: number
		) {
			// If we're within the valid range
			if (accumulatedMb >= minMb && accumulatedMb <= maxMb) {
				const totalMbWithThis = totalMb + accumulatedMb;
				const difference = Math.abs(targetMb - (totalMbWithThis));

				// If this is the best combination so far
				if (difference < bestDifference) {
					bestDifference = difference;
					bestCombination = {
						minerals: [...currentMinerals] as MineralWithQuantity[],
						outputMb: accumulatedMb
					} as MineralCombination;
				}
			}

			// If we exhausted all minerals or exceeded max, return
			if (index >= sortedMinerals.length || accumulatedMb > maxMb) {
				return;
			}

			const mineral = sortedMinerals[index];
			const mineralMb = mineral.mineral.yield;

			// Try using different quantities of this mineral
			for (let qty = 0; qty <= mineral.quantity; qty++) {
				const newMb = accumulatedMb + (mineralMb * qty);
				if (newMb > maxMb) break;

				const newMinerals = qty > 0 ? [
					...currentMinerals,
					{ mineral: mineral.mineral, quantity: qty }
				] : currentMinerals;

				tryCombination(index + 1, newMinerals, newMb);
			}
		}

		// Start the recursive combination search
		tryCombination(0, [], 0);

		// If we couldn't find a valid combination
		if (!bestCombination) {
			return null;
		}

		result = [...result, ...(bestCombination as MineralCombination).minerals];
		totalMb += (bestCombination as MineralCombination).outputMb;
	}

	// Final check if we got exactly the target amount
	if (Math.abs(totalMb - targetMb) > 0) {
		return null;
	}

	return result;
}

export function calculateAlloy(
		targetMb: number,
		targetAlloy: Alloy,
		availableMinerals: MineralWithQuantity[]
): AlloyProductionResult {
	const targetAlloyComponents = targetAlloy.components;
	const mineralsByType = groupMinerals(availableMinerals);
	const totalAvailableByType = calculateAvailableMbByType(mineralsByType);

	// Check if we have enough total material
	const totalAvailable = Array.from(totalAvailableByType.values()).reduce(
			(sum, val) => sum + val, 0
	);

	if (totalAvailable < targetMb) {
		return {
			outputMb: 0,
			usedMinerals: [],
			success: false,
			message: "Not enough total material available"
		};
	}

	// Check if each component has enough material for minimum percentage
	for (const component of targetAlloyComponents) {
		const mineralType = component.mineral.toLowerCase();
		const minRequired = (component.min / 100) * targetMb;
		const available = totalAvailableByType.get(mineralType) || 0;

		if (available < minRequired) {
			return {
				outputMb: 0,
				usedMinerals: [],
				success: false,
				message: `Not enough ${mineralType} for minimum requirement`
			};
		}
	}

	const result = findValidCombination(
			targetMb,
			targetAlloyComponents,
			mineralsByType
	);

	if (!result) {
		return {
			outputMb: 0,
			usedMinerals: [],
			success: false,
			message: "Could not find valid combination of materials"
		};
	}

	return {
		outputMb: targetMb,
		usedMinerals: result,
		success: true
	};
}
