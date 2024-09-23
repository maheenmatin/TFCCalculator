import {Alloy} from "@/app/types";
import React, {useEffect, useState} from "react";


interface AlloyDisplayProps {
	alloy? : string;
}

export function AlloyComponentDisplay({alloy} : Readonly<AlloyDisplayProps>) {
	const [alloyDetails, setAlloyDetails] = useState<Alloy | null>(null);
	const [ingotCount, setIngotCount] = useState<number>();

	const mbPerIngot : number = 144;

	useEffect(() => {
		if (!alloy) return;

		fetch(`/api/alloy?name=${encodeURIComponent(alloy)}`)
				.then(response => response.json())
				.then(data => setAlloyDetails(data))
				.catch(error => console.error("Error fetching alloy details:", error));
	}, [alloy]);

	const handleIngotCountChange = (e : React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setIngotCount(isNaN(value) ? 0 : value);
	};

	return (
			<div className="text-primary">
				{!alloyDetails && (
						<div>
							<p>Could not find data!</p>
						</div>
				)}

				{alloyDetails && (
						<div>
							<div className="mb-4">
								<label htmlFor="ingotCount" className="block mb-2"> How many ingots do you want to make? </label> <input
									type="number"
									id="ingotCount"
									value={ingotCount}
									onChange={handleIngotCountChange}
									min="0"
									className="w-full p-2 border border-gray-300 rounded text-black"
							/>
							</div>
							{ingotCount &&
									<p>Total yield: {ingotCount * mbPerIngot} mB</p>
							}
						</div>
				)}
			</div>
	);
}
