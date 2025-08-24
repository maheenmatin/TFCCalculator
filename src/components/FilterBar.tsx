import React, {useEffect, useRef} from "react";
import {MagnifyingGlassIcon} from "@phosphor-icons/react";
import {hasPhysicalKeyboard} from "@/functions/keyboardDetection";


type FilterOption = { value : number; label : string }

interface FilterBarProps {
	filterOptions : FilterOption[];
	filterType : number;
	searchTerm : string;
	onFilterTypeChange : (type : number) => void;
	onSearchTermChange : (term : string) => void;
}

export const FilterBar : React.FC<FilterBarProps> = (
		{
			filterOptions,
			filterType,
			searchTerm,
			onFilterTypeChange,
			onSearchTermChange,
		}
) => {
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (e : KeyboardEvent) => {
			if (e.key === "/") {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
				<div className="flex space-x-2 w-full sm:w-auto">
					{filterOptions.map((option) => (
							<button
									key={option.value}
									className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
											filterType === option.value
											? "bg-teal-600 text-white hover:bg-teal-500"
											: "bg-gray-300 text-black hover:bg-teal-200"
									}`}
									onClick={() => onFilterTypeChange(option.value)}
							>
								{option.label}
							</button>
					))}
				</div>
				<div className="relative w-full sm:w-64">
					{!searchTerm && <div>
						<MagnifyingGlassIcon
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
							size={20}
						/>
						<div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 text-sm z-10 pointer-events-none">
							{hasPhysicalKeyboard() ? (
									<>
										Type <kbd className="border-blue-500 border pt-0.5 pb-0 p-1 rounded">/</kbd> to quick search
									</>
							) : (
									 "Search"
							 )}
						</div>
					</div>}

					<input
							ref={searchInputRef}
							type="text"
							aria-label="search"
							value={searchTerm}
							onChange={(e) => onSearchTermChange(e.target.value)}
							className={`w-full py-2 border rounded-lg bg-white text-black ${searchTerm ? "px-2" : "px-10"}`}
					/>
				</div>
			</div>
	);
};