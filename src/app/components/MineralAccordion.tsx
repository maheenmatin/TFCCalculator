import {Mineral} from "@/app/types";
import React, {useState} from "react";


interface MineralAccordionProps {
	title: string;
	minerals: Mineral[];
	mineralQuantities: Map<string, number>;
	onQuantityChange: (mineralName: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MineralAccordion({ title, minerals, mineralQuantities, onQuantityChange }: Readonly<MineralAccordionProps>) {
	const [isOpen, setIsOpen] = useState(false);

	return (
			<div className="border rounded-lg mb-4">
				<button
						className="w-full p-4 text-left flex justify-between items-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
						onClick={() => setIsOpen(!isOpen)}
				>
					<span className="font-semibold">{title.toUpperCase()}</span>
					<span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
				</button>

				{isOpen && (
						<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{minerals.map(mineral => (
									<div key={mineral.name} className="flex flex-col">
										<label htmlFor={mineral.name} className="text-sm text-gray-700 mb-1">
											{mineral.name} ({mineral.yield} mB)
										</label>
										<input
												type="number"
												id={mineral.name}
												value={mineralQuantities.get(mineral.name) === 0 ? '' :
												       mineralQuantities.get(mineral.name) ?? ''}
												placeholder="0"
												onChange={(e) => onQuantityChange(mineral.name, e)}
												min="0"
												className="w-full p-2 border border-gray-300 rounded no-spinners"
										/>
									</div>
							))}
						</div>
				)}
			</div>
	);
}