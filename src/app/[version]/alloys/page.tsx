"use client";

import {Alloy} from "@/types";
import {CaretCircleLeft} from "@phosphor-icons/react";
import {AlloySelectionGrid} from "@/components/AlloySelectionGrid";
import {useParams, useRouter} from "next/navigation";


export default function Home() {
	const router = useRouter();
	const params = useParams();

	const handleAlloySelect = (alloy : Alloy) => {
		router.push(`/${params.version}/${alloy.name.toLowerCase()}`);
	};

	const handleBack = () => {
		router.push("/");
	};

	return (
			<main
					className="container mx-auto px-4 py-8"
					role="main"
					aria-label="Alloy Selection"
			>
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center mb-20">
						<button
								onClick={handleBack}
								className="mr-4"
								aria-label="Return to home"
						>
							<CaretCircleLeft
									size={40}
									weight="bold"
									className="text-primary text-teal-100 hover:text-teal-300 transition-colors duration-200"
									aria-hidden="true"
							/>
						</button>

						<h1 className="text-3xl font-bold text-primary flex-grow text-center">
							CHOOSE TARGET ALLOY
						</h1>

						<div className="w-10" aria-hidden="true"/>
					</div>

					{/*TODO: Center grid*/}
					{/*TODO: Export self-centering grid component*/}
					<AlloySelectionGrid onAlloySelect={handleAlloySelect}/>
				</div>
			</main>
	);
}
