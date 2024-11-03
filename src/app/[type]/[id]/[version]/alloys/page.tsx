"use client";

import {Alloy} from "@/types";
import {useParams, useRouter} from "next/navigation";
import {HeadingWithBackButton} from "@/components/HeadingWithBackButton";
import {SelfCenteringGrid} from "@/components/SelfCenteringGrid";
import React, {useCallback, useEffect, useState} from "react";
import {ErrorComponent} from "@/components/ErrorComponent";
import {LoadingSpinner} from "@/components/LoadingSpinner";


export default function Home() {
	const router = useRouter();
	const {type, id, version} = useParams();

	const [alloys, setAlloys] = useState<Alloy[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleAlloySelect = useCallback((alloy : Alloy) => {
		router.push(`/${type}/${id}/${version}/${alloy.name.toLowerCase()}`);
	}, [router, type, id, version]);

	useEffect(() => {
		const fetchAlloys = async() => {
			const response = await fetch(
					`/api/${type}/${id}/${version}/alloy`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			setAlloys(data);
		};

		fetchAlloys()
				.catch((err) => {
					setError("Failed to load alloys");
					console.error("Error fetching alloys:", err);
				})
				.finally(() => {
					setIsLoading(false);
				});
	}, [type, id, version]);

	const renderAlloyButton = useCallback((alloy : Alloy) => (
			<button
					key={alloy.name}
					className="w-full aspect-square flex items-center justify-center p-4 rounded-lg shadow-md bg-teal-100 hover:bg-teal-200 transition-colors duration-200"
					onClick={() => handleAlloySelect(alloy)}
					aria-label={`Select ${alloy.name} alloy`}
			>
            <span className="text-center text-black text-lg font-bold">
                {alloy.name}
            </span>
			</button>
	), [handleAlloySelect]);

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
							handleBackURI="/"
					/>

					{isLoading && <LoadingSpinner/>}
					{error && <ErrorComponent error={error}/>}

					{!isLoading && !error && alloys.length > 0 && (
							<SelfCenteringGrid
									elements={alloys}
									perRow={{
										default : 2,
										sm : 3,
										md : 4,
										lg : 5
									}}
									renderElement={renderAlloyButton}
							/>
					)}

					{!isLoading && !error && alloys.length === 0 && (
							<p className="text-center text-teal-100 mt-4">
								No alloys available for this selection.
							</p>
					)}
				</div>
			</main>
	);
}
