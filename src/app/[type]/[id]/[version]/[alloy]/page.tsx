"use client";

import {useParams} from "next/navigation";
import {AlloyComponentDisplay} from "@/components/AlloyComponentDisplay";
import {HeadingWithBackButton} from "@/components/HeadingWithBackButton";
import {replaceUnderscoreWithSpace} from "@/functions/utils";


export default function AlloyPage() {
	const {type, id, version, alloy} = useParams();
	const alloyString = Array.isArray(alloy) ? alloy.join(',') : alloy;

	return (
			<main
					className="container mx-auto px-4 py-8"
					role="main"
					aria-label="Alloy Calculator"
			>
				<div className="max-w-6xl mx-auto">
					<HeadingWithBackButton
							title={replaceUnderscoreWithSpace(alloyString).toUpperCase()}
							ariaPreviousScreenName="alloy selection"
							handleBackURI={`/${type}/${id}/${version}/alloys`}
					/>

					<AlloyComponentDisplay alloy={alloyString} />
				</div>
			</main>
	);
}
