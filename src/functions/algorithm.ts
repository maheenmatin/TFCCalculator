import {SmeltingOutput, SmeltingComponent, InputMineral} from "@/types";


export interface MineralWithQuantity {
	mineral: InputMineral;
	quantity: number;
}

export interface AlloyProductionResult {
	outputMb: number;
	usedMinerals: MineralWithQuantity[];
	success: boolean;
	message?: string;
}

// interface MineralCombination {
// 	minerals: MineralWithQuantity[];
// 	outputMb: number;
// }

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
		components: SmeltingComponent[],
		mineralsByType: Map<string, MineralWithQuantity[]>
): MineralWithQuantity[] | null {
	 /**
	 Helper function to calculate total mB from a combination
	 */
	function calculateTotalMb(minerals: MineralWithQuantity[]): number {
		return minerals.reduce((sum, m) => sum + (m.mineral.yield * m.quantity), 0);
	}

	/**
	 * Helper function to check if combination is valid
 	 */
	function isValidCombination(minerals: MineralWithQuantity[]): boolean {
		const totalMb = calculateTotalMb(minerals);

		if (Math.abs(Math.round(totalMb) - Math.round(targetMb)) > 0) {
			return false;
		}

		// Group minerals by type and calculate mB for each
		const mbByType = new Map<string, number>();
		for (const mineral of minerals) {
			const type = mineral.mineral.produces;
			const mb = mineral.mineral.yield * mineral.quantity;
			mbByType.set(type, (mbByType.get(type) ?? 0) + mb);
		}

		// Check percentages
		for (const component of components) {
			const mineralType = component.mineral.toLowerCase();
			const mb = mbByType.get(mineralType) ?? 0;
			const percentage = (mb / totalMb) * 100;

			if (percentage < component.min || percentage > component.max) {
				return false;
			}
		}

		return true;
	}

	let currentCombination: MineralWithQuantity[] = [];

	// Process one component at a time
	for (const component of components) {
		const mineralType = component.mineral.toLowerCase();
		const minerals = mineralsByType.get(mineralType) || [];
		const minMb = (component.min / 100) * targetMb;
		const maxMb = (component.max / 100) * targetMb;

		// Get all possible combinations for this component
		const componentCombinations: MineralWithQuantity[][] = [];

		// Sort minerals by yield for efficiency
		const sortedMinerals = [...minerals].sort(
				(a, b) => b.mineral.yield - a.mineral.yield
		);

		// Generate combinations iteratively
		function generateComponentCombinations() {
			const stack: Array<{
				minerals: MineralWithQuantity[],
				index: number,
				mb: number
			}> = [{
				minerals: [],
				index: 0,
				mb: 0
			}];

			while (stack.length > 0) {
				const current = stack.pop()!;

				// If we have a valid amount for this component, save it
				if (current.mb >= minMb && current.mb <= maxMb) {
					componentCombinations.push([...current.minerals]);
				}

				// If we've processed all minerals or exceeded max, continue
				if (current.index >= sortedMinerals.length || current.mb > maxMb) {
					continue;
				}

				const mineral = sortedMinerals[current.index];

				// Try using different quantities of this mineral
				for (let qty = 0; qty <= mineral.quantity; qty++) {
					const newMb = current.mb + (mineral.mineral.yield * qty);
					if (newMb > maxMb) break;

					const newMinerals = qty > 0 ? [
						...current.minerals,
						{ mineral: mineral.mineral, quantity: qty }
					] : current.minerals;

					stack.push(
							{
								minerals: newMinerals,
								index: current.index + 1,
								mb: newMb
							}
					);
				}
			}
		}

		generateComponentCombinations();

		// If no valid combinations for this component, return null
		if (componentCombinations.length === 0) {
			return null;
		}

		// Try each combination with current combination
		let foundValidCombination = false;
		for (const combination of componentCombinations) {
			const testCombination = [...currentCombination, ...combination];

			// For the last component, check if the entire combination is valid
			if (component === components[components.length - 1]) {
				if (isValidCombination(testCombination)) {
					currentCombination = testCombination;
					foundValidCombination = true;
					break;
				}
			} else {
				// For other components, add them and continue
				currentCombination = testCombination;
				foundValidCombination = true;
				break;
			}
		}

		if (!foundValidCombination) {
			return null;
		}
	}

	return currentCombination;
}

export function calculateAlloy(
		targetMb: number,
		targetAlloy: SmeltingOutput,
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
		const available = totalAvailableByType.get(mineralType) ?? 0;

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
