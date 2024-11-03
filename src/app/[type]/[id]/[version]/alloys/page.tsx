"use client";

import {Alloy} from "@/types";
import {useParams, useRouter} from "next/navigation";
import {HeadingWithBackButton} from "@/components/HeadingWithBackButton";
import {SelfCenteringGrid} from "@/components/SelfCenteringGrid";
import React, {useEffect, useState} from "react";
import {ErrorComponent} from "@/components/ErrorComponent";
import {LoadingSpinner} from "@/components/LoadingSpinner";


export default function Home() {
	const router = useRouter();
	const params = useParams();

	const [alloys, setAlloys] = useState<Alloy[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleAlloySelect = (alloy : Alloy) => {
		router.push(`/${params.version}/${alloy.name.toLowerCase()}`);
	};

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

	return (
			<main
					className="container mx-auto px-4 py-8"
					role="main"
					aria-label="Alloy Selection"
			>
				<div className="max-w-6xl mx-auto">
					<HeadingWithBackButton
							title="CHOOSE TARGET ALLOY"
							ariaPreviousScreenName="home"
							handleBackURI={`/`}
					/>

					{isLoading && <LoadingSpinner fullScreen={true}/>}
					{error && <ErrorComponent error={error}/>}

					{!isLoading && !error &&
							<SelfCenteringGrid
									elements={alloys}
									perRow={{
										default : 2,
										sm : 3,
										md : 4,
										lg : 5
									}}
									renderElement={(alloy) => (
											<button
													className="w-full aspect-square flex items-center justify-center p-4 rounded-lg shadow-md bg-teal-100 hover:bg-teal-200 transition-colors duration-200"
													onClick={() => handleAlloySelect(alloy)}
													aria-label={`Select ${alloy.name} alloy`}
											>
												<span className="text-center text-black text-lg font-bold">{alloy.name}</span>
											</button>
									)}
							/>
					}
				</div>
			</main>
	);
}
