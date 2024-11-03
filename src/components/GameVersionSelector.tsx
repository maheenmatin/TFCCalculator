import {ErrorComponent} from "@/components/ErrorComponent";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {LoadingSpinner} from "@/components/LoadingSpinner";
import {BaseGameVersion, GameVersions, VersionType} from "@/types/gameversions";


interface GameVersionSelectorProps {
}

export function GameVersionSelector({} : Readonly<GameVersionSelectorProps>) {
	const router = useRouter();
	const [options, setOptions] = useState<GameVersions | null>(null);
	const [selectedType, setSelectedType] = useState<VersionType>("modpack");
	const [selectedOption, setSelectedOption] = useState<BaseGameVersion | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPackages = async() => {
			const response = await fetch("/api/options");
			if (!response.ok) {
				throw new Error("Failed to fetch options");
			}

			return response;
		};

		fetchPackages()
				.then(async(response) => {
					const data = await response.json();
					setOptions(data);

					// Auto-select first supported package if available
					if (data.modpack.length > 0) {
						setSelectedOption(data.modpack[0]);
					}
				})
				.catch((err) => {
					setError("Failed to load options");
					console.error(err);
				})
				.finally(() => setIsLoading(false));
	}, []);

	const handleCalculate = () => {
		if (!selectedOption) {
			return;
		}

		const versionPath = `${selectedOption.gameVersion}_${selectedOption.version}`;
		router.push(`/${selectedType}/${selectedOption.id}/${versionPath}/alloys`);
	};

	if (isLoading) {
		return (
				<LoadingSpinner/>
		);
	}

	if (error) {
		return (
				<ErrorComponent error={error}/>
		);
	}

	return (
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col items-center gap-4">
						<div className="flex flex-row items-center gap-4">
							<select
									value={selectedType}
									onChange={(e) => setSelectedType(e.target.value as VersionType)}
									className="w-32 p-2 rounded border border-teal-500 bg-transparent text-teal-100"
									aria-label="Select type"
							>
								<option value="modpack">Modpack</option>
								<option value="mod">Mod</option>
							</select>

							<select
									value={selectedOption?.id || ""}
									onChange={(e) => {
										const selected = options?.[selectedType].find(
												p => p.id === e.target.value
										);
										setSelectedOption(selected || null);
									}}
									className="w-72 p-2 rounded border border-teal-500 bg-transparent text-teal-100"
									aria-label={`Select ${selectedType}`}
							>
								{options?.[selectedType].map((pkg) => (
										<option key={pkg.id} value={pkg.id}>
											{pkg.displayName} ({pkg.version})
										</option>
								))}
							</select>
						</div>

						<button
								onClick={handleCalculate}
								disabled={!selectedOption}
								className="px-6 py-2 rounded
								bg-teal-600 hover:bg-teal-700 transition-colors duration-200 text-white
								disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Go to alloy calculator"
						>
							Calculate
						</button>
					</div>
				</div>
			</main>
	);
}