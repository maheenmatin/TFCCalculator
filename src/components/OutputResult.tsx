import {AlloyProductionResult} from "@/functions/algorithm";
import React from "react";


const successFormatting = "bg-green-700 text-white";
const failureFormatting = "bg-yellow-400 text-black";

interface OutputResultProps {
	output : AlloyProductionResult | null;
	mbPerIngot : number;
}

export function OutputResult({output, mbPerIngot} : Readonly<OutputResultProps>) {
	if (!output) return;

	const success = output.success;
	return (
			<div className={`rounded-lg shadow p-6 ${success ? successFormatting : failureFormatting}`}>
				<h2 className="text-xl text-center font-bold mb-4">OUTPUT</h2>
				{GetInnerOutput(output, mbPerIngot)}
			</div>
	)
}

function GetInnerOutput(output : AlloyProductionResult, mbPerIngot : number) {
	const success = output.success;

	if (!success) return (<p className="text-lg text-center">{output.message}!</p>)

	return (
			<div>
				<p className="text-xl text-center">Yields exactly {output.outputMb / mbPerIngot} ingots!</p>
				<div className="p-4">
					<div className="flex flex-wrap justify-center gap-4">
						{output.usedMinerals.map(usedMineral => {
							const mineralName = usedMineral.mineral.name;
							const mineralQuantity = usedMineral.quantity;

							return (
									<div key={mineralName}
									     className="bg-white text-black rounded-lg flex flex-col text-center w-full
								     md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]">
										<p className="mt-3 text-lg">{mineralName}</p>
										<p className="mb-3 text-sm">x{mineralQuantity}</p>
									</div>
							)
						})}
					</div>
				</div>
			</div>
	)
}
