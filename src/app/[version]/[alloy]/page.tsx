"use client";

import {useRouter, useParams} from "next/navigation";
import {AlloyComponentDisplay} from "@/components/AlloyComponentDisplay";
import {CaretCircleLeft} from "@phosphor-icons/react";


export default function AlloyPage() {
	const router = useRouter();
	const params = useParams();
	const version = params.version as string;
	const alloy = params.alloy as string;

	const handleBack = () => {
		router.push(`/${version}/alloys`);
	};

	return (
			<main
					className="container mx-auto px-4 py-8"
					role="main"
					aria-label="Alloy Calculator"
			>
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center mb-20">
						<button
								onClick={handleBack}
								className="mr-4"
								aria-label="Return to alloy selection"
						>
							<CaretCircleLeft
									size={40}
									weight="bold"
									className="text-primary text-teal-100 hover:text-teal-300 transition-colors duration-200"
									aria-hidden="true"
							/>
						</button>

						<h1 className="text-3xl font-bold text-primary flex-grow text-center">
							{alloy.toUpperCase()}
						</h1>

						<div className="w-10" aria-hidden="true"/>
					</div>

					<AlloyComponentDisplay alloy={alloy}/>
				</div>
			</main>
	);
}