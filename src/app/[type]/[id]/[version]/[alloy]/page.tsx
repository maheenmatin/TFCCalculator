"use client";

import {useParams} from "next/navigation";
import {AlloyComponentDisplay} from "@/components/AlloyComponentDisplay";
import {HeadingWithBackButton} from "@/components/HeadingWithBackButton";


export default function AlloyPage() {
	const params = useParams();
	const version = params.version as string;
	const alloy = params.alloy as string;

	return (
			<main
					className="container mx-auto px-4 py-8"
					role="main"
					aria-label="Alloy Calculator"
			>
				<div className="max-w-6xl mx-auto">
					<HeadingWithBackButton
							title={alloy.toUpperCase()}
							ariaPreviousScreenName="alloy selection"
							handleBackURI={`/${version}/alloys`}
					/>

					<AlloyComponentDisplay alloy={alloy}/>
				</div>
			</main>
	);
}