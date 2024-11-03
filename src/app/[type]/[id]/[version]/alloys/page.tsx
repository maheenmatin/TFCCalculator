"use client";

import {Alloy} from "@/types";
import {AlloySelectionGrid} from "@/components/AlloySelectionGrid";
import {useParams, useRouter} from "next/navigation";
import {HeadingWithBackButton} from "@/components/HeadingWithBackButton";


export default function Home() {
	const router = useRouter();
	const params = useParams();

	const handleAlloySelect = (alloy : Alloy) => {
		router.push(`/${params.version}/${alloy.name.toLowerCase()}`);
	};

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

					<AlloySelectionGrid onAlloySelect={handleAlloySelect}/>
				</div>
			</main>
	);
}
