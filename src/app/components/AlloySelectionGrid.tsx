import {Alloy} from "@/app/types";
import {useEffect, useState} from "react";


interface AlloyGridProps {
	onAlloySelect : (alloy : Alloy) => void;
}

export function AlloySelectionGrid({onAlloySelect} : Readonly<AlloyGridProps>) {
	const [alloys, setAlloys] = useState<Alloy[]>([]);

	useEffect(() => {
		async function fetchAlloys() {
			const response = await fetch("/api/alloy");
			const data = await response.json();
			setAlloys(data);
		}

		fetchAlloys();
	}, []);

	return (
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{alloys.map((alloy) => (
						<button
								key={alloy.name}
								className="aspect-square bg-blue flex items-center justify-center p-4 rounded-lg shadow-md hover:bg-blue-light transition-colors duration-200"
								onClick={() => onAlloySelect(alloy)}
						>
							<span className="text-center font-semibold text-primary">{alloy.name}</span>
						</button>
				))}
			</div>
	);
}