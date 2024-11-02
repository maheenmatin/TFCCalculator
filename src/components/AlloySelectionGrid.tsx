import {Alloy} from "@/types";
import {useEffect, useState} from "react";


interface AlloyGridProps {
	onAlloySelect : (alloy : Alloy) => void;
}

export function AlloySelectionGrid({onAlloySelect} : Readonly<AlloyGridProps>) {
	const [alloys, setAlloys] = useState<Alloy[]>([]);

	useEffect(() => {
		fetch("/api/alloy")
				.then(response => response.json())
				.then(data => setAlloys(data))
				.catch(error => console.error("Error fetching alloys:", error))
	}, []);

	return (
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{alloys.map((alloy) => (
						<button
								key={alloy.name}
								className="aspect-square flex items-center justify-center p-4 rounded-lg shadow-md bg-teal-100 hover:bg-teal-200 transition-colors duration-200"
								onClick={() => onAlloySelect(alloy)}
						>
							<span className="text-center text-black font-bold">{alloy.name}</span>
						</button>
				))}
			</div>
	);
}