import {MineralAccordion} from "@/app/components/MineralAccordion";
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
	};

	const handleMineralQuantityChange = (mineralName: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
		setMineralQuantities(prev => new Map(prev).set(mineralName, isNaN(value) ? 0 : value));
	};

	const handleCalculate = () => {
		if (!alloyMixture || !alloyMinerals || isCalculating) return;

		// TODO: Handle target ingot count 0 as separate case!
		if (targetIngotCount === 0) {
			return;
		}

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

	return (
			<div className="container mx-auto p-4" onKeyDown={handleKeyPress}>
				<div className="grid grid-cols-1 gap-6">
					<div className="bg-white text-black rounded-lg shadow p-6">
						<h2 className="text-xl text-center font-bold mb-4">CONSTRAINTS</h2>

						{/* Ingot Count Input */}
						<div className="mb-6">
							<label htmlFor="ingotCount" className="block mb-2"> How many ingots do you want to make? </label>
							<input
								type="number"
								id="ingotCount"
								value={targetIngotCount === 0 ? '' : targetIngotCount}
								onChange={handleIngotCountChange}
								min="0"
								className="w-full p-2 border border-gray-300 rounded"
						/>
						</div>
					</div>

					{error && <div className="bg-red-700 text-white text-center rounded-lg shadow p-6">
						<h2 className="text-xl font-bold mb-4">ERROR</h2>
						<p>{error instanceof Error ? error.message : error}</p>
						<div className="bg-white text-black rounded-lg mt-4">
							<h2 className="text-xl font-bold pt-4">Struggling?</h2>
							<p className="text-lg pt-2 p-4">
								If this issue persists,&nbsp;
								<a href="https://github.com/Supermarcel10/TFGCalculator/issues/new/choose" target="_blank" className="text-cyan-500"> open an issue </a>
								&nbsp;with a screenshot of the entire page; we&apos;ll investigate!
							</p>
						</div>
					</div>}

					{result && !error && <div className={`rounded-lg shadow p-6 ${
							result.success
							? "bg-green-700 text-white"
							: "bg-yellow-400 text-black"
					}`}>
						<h2 className="text-xl text-center font-bold mb-4">OUTPUT</h2>
						{!result.success && <p className="text-lg text-center">{result.message}!</p>}
						{result.success && <div>
							<p className="text-xl text-center">Yields exactly {result.outputMb / mbPerIngot} ingots!</p>
							<div className="p-4">
								<div className="flex flex-wrap justify-center gap-4">
									{result.usedMinerals.map(usedMineral => {
										const mineralName = usedMineral.mineral.name;
										const mineralQuantity = usedMineral.quantity;

										return (
												<div key={mineralName}
												     className="bg-white text-black rounded-lg flex flex-col text-center w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]">
													<p className="mt-3 text-lg">{mineralName}</p>
													<p className="mb-3 text-sm">x{mineralQuantity}</p>
												</div>
										)
									})}
								</div>
							</div>
						</div>}
					</div>}

					{alloyMixture && alloyMinerals && <div className="bg-white text-black rounded-lg shadow p-6">
						<h2 className="text-xl text-center font-bold mb-4">INPUT</h2>
						{/* Minerals */}
						{alloyMixture?.components.map(component => {
							const componentMinerals = groupedMinerals.get(component.mineral.toLowerCase()) || [];
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
									className={`px-4 py-2 rounded transition-colors ${
											isCalculating
											? "bg-gray-400 cursor-not-allowed"
											: "bg-blue-500 hover:bg-blue-600"
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
