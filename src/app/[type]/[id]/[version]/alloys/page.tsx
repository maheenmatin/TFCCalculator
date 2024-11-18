"use client";

import {SmeltingOutput} from "@/types";
import {useParams, useRouter} from "next/navigation";
import {HeadingWithBackButton} from "@/components/HeadingWithBackButton";
import {SelfCenteringGrid} from "@/components/SelfCenteringGrid";
import React, {useCallback, useEffect, useState} from "react";
import {ErrorComponent} from "@/components/ErrorComponent";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {capitaliseFirstLetterOfEachWord} from "@/functions/utils";
import {FilterBar} from "@/components/FilterBar";
import {CreationSelectionFilter} from "@/types/filters";


export default function Home() {
	const router = useRouter();
	const {type, id, version} = useParams();

	const [alloys, setAlloys] = useState<SmeltingOutput[]>([]);
	const [filteredAlloys, setFilteredAlloys] = useState<SmeltingOutput[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filterType, setFilterType] = useState<CreationSelectionFilter>(CreationSelectionFilter.All);
	const [searchTerm, setSearchTerm] = useState("");

	const handleAlloySelect = useCallback((alloy : SmeltingOutput) => {
		router.push(`/${type}/${id}/${version}/${alloy.name}`);
	}, [router, type, id, version]);

	useEffect(() => {
		let result = alloys;

		if (filterType !== CreationSelectionFilter.All) {
			result = result.filter(smeltingOutput =>
					                       filterType === CreationSelectionFilter.Minerals
					                       ? smeltingOutput.isMineral
					                       : !smeltingOutput.isMineral
			);
		}

		if (searchTerm) {
			const lowercaseSearch = searchTerm.toLowerCase();
			result = result.filter(alloy =>
					                       alloy.name.toLowerCase().includes(lowercaseSearch)
			);
		}

		setFilteredAlloys(result);
	}, [alloys, filterType, searchTerm]);

	useEffect(() => {
		fetch(`/api/${type}/${id}/${version}/alloy`)
				.then(response => {
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					return response.json();
				})
				.then(data => {
					setAlloys(data);
					setFilteredAlloys(data);
				})
				.catch(error => {
					setError("Failed to load alloys");
					console.error("Error fetching alloys:", error);
				})
				.finally(() => {
					setIsLoading(false);
				});
	}, [type, id, version]);

	// const filterOptions = Object.values(CreationSelectionFilter)
	//                             .filter(value => typeof value === "number")
	//                             .map(value => ({
	// 	                            value,
	// 	                            label : CreationSelectionFilter[value]
	//                             }));

	const renderAlloyButton = useCallback((alloy : SmeltingOutput) => {
		const displayAlloyName = capitaliseFirstLetterOfEachWord(alloy.name);

		return (
				<button
						key={alloy.name}
						className="w-full aspect-square flex items-center justify-center p-4 rounded-lg shadow-md bg-teal-100 hover:bg-teal-200 transition-colors duration-200"
						onClick={() => handleAlloySelect(alloy)}
						aria-label={`Select ${displayAlloyName} alloy`}
				>
            <span className="text-center text-black text-lg font-bold">
                {displayAlloyName}
            </span>
				</button>
		);
	}, [handleAlloySelect]);

	return (
			<main
					className="container mx-auto px-4 py-8"
					role="main"
					aria-label="Alloy Selection"
			>
				<div className="max-w-6xl mx-auto">
					<HeadingWithBackButton
							title="CHOOSE TARGET OUTPUT"
							ariaPreviousScreenName="home"
							handleBackURI="/"
					/>

					<FilterBar
							filterOptions={
								Object.values(CreationSelectionFilter)
								      .filter(value => typeof value === "number")
								      .map(value => ({
									      value,
									      label : CreationSelectionFilter[value]
								      }))}
							filterType={filterType}
							searchTerm={searchTerm}
							onFilterTypeChange={setFilterType}
							onSearchTermChange={setSearchTerm}
					/>

					{isLoading && <LoadingSpinner/>}
					{error && <ErrorComponent error={error}/>}

					{!isLoading && !error && filteredAlloys.length > 0 && (
							<SelfCenteringGrid
									elements={filteredAlloys}
									perRow={{
										default : 2,
										sm : 3,
										md : 4,
										lg : 5
									}}
									renderElement={renderAlloyButton}
							/>
					)}

					{!isLoading && !error && filteredAlloys.length === 0 && (
							<p className="text-center text-teal-100 mt-4">
								No alloys available for this selection.
							</p>
					)}
				</div>
			</main>
	);
}
