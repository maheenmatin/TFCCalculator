import {ErrorComponent} from "@/app/components/ErrorComponent";
import {MineralAccordion} from "@/app/components/MineralAccordion";
import {OutputResultComponent} from "@/app/components/OutputResultComponent";
import {AlloyProductionResult, calculateAlloy, MineralWithQuantity} from "@/app/functions/algorithm";
import {Alloy, Mineral} from "@/app/types";
import React, {useEffect, useState} from "react";


interface AlloyDisplayProps {
	alloy? : string;
}

// TODO: Add overrides for ingots and nuggets!
export function AlloyComponentDisplay({alloy} : Readonly<AlloyDisplayProps>) {
	const [alloyMixture, setAlloyMixture] = useState<Alloy | null>(null);
	const [alloyMinerals, setAlloyMinerals] = useState<Mineral[]>([]);
	const [targetIngotCount, setTargetIngotCount] = useState<number>(0);
	const [mineralQuantities, setMineralQuantities] = useState<Map<string, number>>(new Map());

	const [isCalculating, setIsCalculating] = useState<boolean>(false);
	const [result, setResult] = useState<AlloyProductionResult | null>(null);
	const [isResultAlteredSinceLastCalculation, setIsResultAlteredSinceLastCalculation] = useState<boolean>(false);
	const [error, setError] = useState<Error | string | null>(null);

	const mbPerIngot : number = 144;

	useEffect(() => {
		if (!alloy) return;
		if (alloyMixture && alloyMinerals) return;

		fetch(`/api/alloy/${encodeURIComponent(alloy)}`)
				.then(response => response.json())
				.then(data => setAlloyMixture(data))
				.catch(error => console.error("Error fetching alloy details:", error));

		fetch(`api/alloy/${encodeURIComponent(alloy)}/minerals`)
				.then(response => response.json())
				.then(data => setAlloyMinerals(data))
				.catch(error => console.error("Error fetching alloy minerals:", error))
	}, [alloy, alloyMixture, alloyMinerals]);

	const handleIngotCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
		setTargetIngotCount(isNaN(value) ? 0 : value);
		setIsResultAlteredSinceLastCalculation(true);
	};

	const handleMineralQuantityChange = (mineralName: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
		setMineralQuantities(prev => new Map(prev).set(mineralName, isNaN(value) ? 0 : value));
		setIsResultAlteredSinceLastCalculation(true);
	};

	const handleCalculate = () => {
		if (!alloyMixture || !alloyMinerals || isCalculating) return;

		setIsCalculating(true);

		try {
			const mineralWithQuantities: MineralWithQuantity[] = Array.from(mineralQuantities.entries()).map(
					([mineralName, quantity]) => ({
						mineral: alloyMinerals.find(m => m.name === mineralName)!,
						quantity
					})).filter(m => m.quantity > 0);

			const result = calculateAlloy(targetIngotCount * mbPerIngot, alloyMixture, mineralWithQuantities);
			setResult(result);
		} catch (e) {
			if (e instanceof Error) {
				setError(e);
			} else {
				setError(String(e));
			}
		} finally {
			setIsCalculating(false);
			setIsResultAlteredSinceLastCalculation(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleCalculate();
		}
	};

	// Group minerals by what they produce
	const groupedMinerals = React.useMemo(() => {
		if (!alloyMinerals) return new Map<string, Mineral[]>();

		const grouped = new Map<string, Mineral[]>();
		alloyMinerals.forEach(mineral => {
			const produces = mineral.produces.toLowerCase();
			if (!grouped.has(produces)) {
				grouped.set(produces, []);
			}
			grouped.get(produces)?.push(mineral);
		});
		return grouped;
	}, [alloyMinerals]);

	const isReadyToShowInputs : boolean =
			targetIngotCount !== 0
			&& alloyMixture !== null
			&& alloyMinerals !== null;

	const isReadyToShowOutputs : boolean =
			targetIngotCount !== 0
			&& !isResultAlteredSinceLastCalculation
			&& !error;

	return (
			<div className="container mx-auto p-4" onKeyDown={handleKeyPress}>
				<div className="grid grid-cols-1 gap-6">
					<div className="bg-white text-black rounded-lg shadow p-6">
						<h2 className="text-xl text-center font-bold mb-4">CONSTRAINTS</h2>
						<p className="text-lg text-center mb-8">Enter any constraints and target ingot count!</p>

						{/* Ingot Count Input */}
						<div className="mb-6">
							<label htmlFor="ingotCount" className="text-gray-700 block mb-2">Desired Ingot Quantity</label>
							<input
								type="number"
								id="ingotCount"
								value={targetIngotCount === 0 ? '' : targetIngotCount}
								placeholder="0"
								onChange={handleIngotCountChange}
								min="0"
								className="w-full p-2 border border-gray-300 rounded"
						/>
						</div>
					</div>

					<ErrorComponent error={error}/>
					{isReadyToShowOutputs && <OutputResultComponent output={result} mbPerIngot={mbPerIngot}/>}

					{isReadyToShowInputs && <div className="bg-white text-black rounded-lg shadow p-6">
						<h2 className="text-xl text-center font-bold mb-4">INPUT</h2>
						<p className="text-lg text-center mb-8">Enter all available minerals in your inventory!</p>

						{/* Minerals */}
						{alloyMixture?.components.map(component => {
							const componentMinerals = groupedMinerals.get(component.mineral.toLowerCase()) || [];

							if (componentMinerals.length == 0) {
								return (
										<ErrorComponent
												key={component.mineral.toLowerCase()}
												error={`Failed to retrieve mineral ${component.mineral.toLowerCase()}`}
												className={"mb-8"}
										/>
								);
							}
							return (
									<MineralAccordion
											key={component.mineral}
											title={component.mineral} minerals={componentMinerals}
											mineralQuantities={mineralQuantities}
											onQuantityChange={handleMineralQuantityChange}
									/>
							);
						})}

						{/* Calculate Button */}
						<div className="mt-6 text-center">
							<button
									onClick={handleCalculate}
									disabled={isCalculating}
									className={`px-4 py-2 mt-6 rounded transition-colors ${
											isCalculating
											? "bg-gray-400 cursor-not-allowed"
											: "bg-green-600 hover:bg-green-700"
									} text-white`}
							>
								{isCalculating ? "Calculating..." : "Calculate"}
							</button>
						</div>
					</div>}
				</div>
			</div>
	);
}
