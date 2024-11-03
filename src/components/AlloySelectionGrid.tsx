import {Alloy} from "@/types";
import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ErrorComponent} from "@/components/ErrorComponent";
import {SelfCenteringGrid} from "@/components/SelfCenteringGrid";


interface AlloyGridProps {
	onAlloySelect : (alloy : Alloy) => void;
}

export function AlloySelectionGrid({onAlloySelect} : Readonly<AlloyGridProps>) {
	const [alloys, setAlloys] = useState<Alloy[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const params = useParams();

	useEffect(() => {
		setIsLoading(true);
		setError(null);

		const fetchAlloys = async() => fetch(`/api/${params.version}/alloy`);

		fetchAlloys()
				.then(response => {
					if (!response.ok) {
						throw new Error("Failed to fetch alloys");
					}

					return response.json();
				})
				.then(data => {
					setAlloys(data);
					setIsLoading(false);
				})
				.catch(error => {
					console.error("Error fetching alloys:", error);
					setError("Failed to load alloys. Please try again later.");
					setIsLoading(false);
				});
	}, [params.version]);

	if (isLoading) {
		return (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-100"/>
				</div>
		);
	}

	if (error) {
		return (
					<ErrorComponent error={error}/>
		);
	}

	return (
			<SelfCenteringGrid
					elements={alloys}
					perRow={{
						default: 2,
						sm: 3,
						md: 4,
						lg: 5
					}}
					renderElement={(alloy) => (
							<button
									className="w-full aspect-square flex items-center justify-center p-4 rounded-lg shadow-md bg-teal-100 hover:bg-teal-200 transition-colors duration-200"
									onClick={() => onAlloySelect(alloy)}
									aria-label={`Select ${alloy.name} alloy`}
							>
								<span className="text-center text-black text-lg font-bold">{alloy.name}</span>
							</button>
					)}
			/>
	);
}