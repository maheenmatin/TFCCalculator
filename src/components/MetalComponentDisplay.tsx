import {ErrorComponent} from "@/components/ErrorComponent";
import {MineralAccordion} from "@/components/MineralAccordion";
import {OutputResult} from "@/components/OutputResult";
import {calculateMetal, MetalProductionResult, MineralWithQuantity} from "@/functions/algorithm";
import {capitaliseFirstLetterOfEachWord, getBaseMineralFromOverride} from "@/functions/utils";
import {DesiredOutputTypes, InputMineral, MineralUseCase, SmeltingComponent, SmeltingOutput} from "@/types";
import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";


interface MetalDisplayProps {
	metal? : string;
}

export function MetalComponentDisplay({metal} : Readonly<MetalDisplayProps>) {
	const {type, id, version} = useParams();

	const [metalMixture, setMetalMixture] = useState<SmeltingOutput | null>(null);
	const [metalMinerals, setMetalMinerals] = useState<InputMineral[]>([]);
	const [unit, setUnit] = useState<DesiredOutputTypes>(DesiredOutputTypes.Ingot);
	const [desiredOutputInUnits, setdesiredOutputInUnits] = useState<number>(0);
	const [mineralQuantities, setMineralQuantities] = useState<Map<string, number>>(new Map());

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isCalculating, setIsCalculating] = useState<boolean>(false);
	const [result, setResult] = useState<MetalProductionResult | null>(null);
	const [isResultAlteredSinceLastCalculation, setIsResultAlteredSinceLastCalculation] = useState<boolean>(false);
	const [error, setError] = useState<Error | string | null>(null);

	// TODO: Utilise the version specific constants instead.
	const mbPerIngot : number = 144;
	const mbPerNugget : number = 16;

	useEffect(() => {
		if (!metal) {
			return;
		}

		fetch(`/api/${type}/${id}/${version}/metal/${metal}`)
				.then(response => {
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					return response.json();
				})
				.then(data => {
					setMetalMixture(data.material);
					setMetalMinerals(data.minerals);
				})
				.catch(error => {
					setError("Error fetching metal details");
					console.error("Error fetching metal details:", error);
				})
				.finally(() => setIsLoading(false));
	}, [type, id, version, metal]);

	const handleDesiredTargetChange = (e : React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
		setdesiredOutputInUnits(isNaN(value) ? 0 : value);
		setIsResultAlteredSinceLastCalculation(true);
	};

	const handleMineralQuantityChange = (mineralName : string, e : React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
		setMineralQuantities(prev => new Map(prev).set(mineralName, isNaN(value) ? 0 : value));
		setIsResultAlteredSinceLastCalculation(true);
	};

	const unitToMbConversion : Record<DesiredOutputTypes, number> = {
		[DesiredOutputTypes.Ingot] : mbPerIngot,
		[DesiredOutputTypes.Nugget] : mbPerNugget,
		[DesiredOutputTypes.Millibucket] : 1
	} as const;

	const getDesiredOutputInMb = () : number => desiredOutputInUnits * (unitToMbConversion[unit] ?? 1);

	const handleCalculate = async() => {
		if (!metalMixture || !metalMinerals || isCalculating) {
			return;
		}

		setIsCalculating(true);
		await new Promise(resolve => setTimeout(resolve, 0));

		try {
			const mineralWithQuantities : MineralWithQuantity[] = Array.from(mineralQuantities.entries()).map(
					([mineralName, quantity]) => {
						let mineral = metalMinerals.find(m => m.name === mineralName);
						if (!mineral) {
							const baseMineralName = getBaseMineralFromOverride(mineralName);
							if (mineralName.toLowerCase().includes("ingot")) {
								mineral = ingotOverride(baseMineralName);
							} else if (mineralName.toLowerCase().includes("nugget")) {
								mineral = nuggetOverride(baseMineralName);
							}
						}
						return {
							mineral : mineral!,
							quantity
						};
					}).filter(m => m.quantity > 0);

			setResult(calculateMetal(getDesiredOutputInMb(), metalMixture, mineralWithQuantities));
		} catch (err) {
			setError(`Failed to calculate! ${err}`);
			console.error("Error calculating:", err);
		} finally {
			setIsCalculating(false);
			setIsResultAlteredSinceLastCalculation(false);
		}
	};

	const handleKeyPress = async(e : React.KeyboardEvent) => {
		if (e.key === "Enter") {
			await handleCalculate();
		}
	};

	// Group minerals by what they produce
	const groupedMinerals = React.useMemo(() => {
		if (!metalMinerals) {
			return new Map<string, InputMineral[]>();
		}

		const grouped = new Map<string, InputMineral[]>();
		metalMinerals.forEach(mineral => {
			const produces = mineral.produces.toLowerCase();
			if (!grouped.has(produces)) {
				grouped.set(produces, []);
			}
			grouped.get(produces)?.push(mineral);
		});
		return grouped;
	}, [metalMinerals]);

	const isReadyToShowInputs : boolean =
			desiredOutputInUnits !== 0
			&& !isLoading;

	const isReadyToShowOutputs : boolean =
			desiredOutputInUnits !== 0
			&& !isResultAlteredSinceLastCalculation
			&& !error;

	const ingotOverride = (mineral : string) : InputMineral => {
		return {
			name : `${capitaliseFirstLetterOfEachWord(mineral)} Ingot`,
			produces : mineral,
			yield : mbPerIngot,
			uses : [
				MineralUseCase.Vessel,
				MineralUseCase.Crucible
			]
		};
	};

	const nuggetOverride = (mineral : string) : InputMineral => {
		return {
			name : `${capitaliseFirstLetterOfEachWord(mineral)} Nugget`,
			produces : mineral,
			yield : mbPerNugget,
			uses : [
				MineralUseCase.Vessel,
				MineralUseCase.Crucible
			]
		};
	};

	function componentIngotAvailable(component : SmeltingComponent) : boolean {
		return component.hasIngot == null || component.hasIngot;
	}

	function componentNugetAvailable(component : SmeltingComponent) : boolean {
		return component.hasNugget == null || component.hasNugget;
	}

	return (
			<div className="container mx-auto p-4 grid grid-cols-1 gap-6">
				<div className="bg-white text-black rounded-lg shadow p-6">
					<h2 className="text-xl text-center font-bold mb-4">CONSTRAINTS</h2>
					<p className="text-lg text-center mb-8">Enter any constraints and target ingot count!</p>

					{/* Count Input */}
					{/* TODO: Investigate some issues with dark reader related to this */}
					<div className="mb-6">
						<label htmlFor="desiredOutputCount" className="block mb-2 text-gray-700">Desired Quantity</label>
						<div className="flex">
							<input
									type="number"
									id="desiredOutputCount"
									value={desiredOutputInUnits === 0 ? "" : desiredOutputInUnits}
									placeholder="0"
									onChange={handleDesiredTargetChange}
									onKeyDown={handleKeyPress}
									min="0"
									className="flex-1 p-2 rounded-l border border-r-0 border-gray-300 bg-white text-gray-700 no-spinners"
							/>
							<select
									value={unit}
									onChange={(e) => setUnit(e.target.value as unknown as DesiredOutputTypes)}
									className="w-24 p-2 rounded-r border border-l-0 border-gray-300 bg-white text-gray-700"
									aria-label="unit"
							>
								<option value={DesiredOutputTypes.Ingot} aria-label="ingots">Ingot(s)</option>
								<option value={DesiredOutputTypes.Nugget} aria-label="nuggets">Nugget(s)</option>
								<option value={DesiredOutputTypes.Millibucket} aria-label="milli-bucket">mB</option>
							</select>
						</div>
					</div>
				</div>

				<ErrorComponent error={error}/>
				{isReadyToShowOutputs && <OutputResult output={result} unit={unit} conversions={unitToMbConversion}/>}

				{isReadyToShowInputs && <div className="bg-white text-black rounded-lg shadow p-6">
					<h2 className="text-xl text-center font-bold mb-4">INPUT</h2>
					<p className="text-lg text-center mb-8">Enter all available minerals in your inventory!</p>

					{/* Minerals */}
					{metalMixture?.components.map(component => {
						const mineral = component.mineral.toLowerCase();
						let componentMinerals = groupedMinerals.get(mineral) || [];

						if (componentMinerals.length === 0) {
							return (
									<ErrorComponent
											key={mineral}
											error={`Failed to retrieve mineral ${mineral}`}
											className="mb-6"
									/>
							);
						}

						componentMinerals = [...componentMinerals];

						const hasIngot = componentMinerals.some(m => m.name.toLowerCase().includes("ingot"));
						const hasNugget = componentMinerals.some(m => m.name.toLowerCase().includes("nugget"));

						if (!hasIngot && componentIngotAvailable(component)) {
							componentMinerals.push(ingotOverride(component.mineral));
						}

						if (!hasNugget && componentNugetAvailable(component)) {
							componentMinerals.push(nuggetOverride(component.mineral));
						}

						return (
								<MineralAccordion
										key={mineral}
										title={capitaliseFirstLetterOfEachWord(mineral)}
										minerals={componentMinerals}
										mineralQuantities={mineralQuantities}
										onQuantityChange={handleMineralQuantityChange}
										onInputKeyPress={handleKeyPress}
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
	);
}
