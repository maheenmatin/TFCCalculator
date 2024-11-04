import React from "react";
import type {Metadata} from "next";
import {capitaliseFirstLetterOfEachWord} from "@/functions/utils";


type ParamProps = {
	params : {
		type : string;
		id : string;
		version : string;
		alloy? : string
	};
};

export async function generateMetadata({params} : ParamProps) : Promise<Metadata> {
	const alloyName = params.alloy
	                  ? capitaliseFirstLetterOfEachWord(params.alloy)
	                  : null;

	const baseTitle = "TerraFirmaCraft Alloy Calculator";
	const shortHandTitle = "TFC Alloy Calculator";
	const title = alloyName
	              ? `${alloyName} - ${shortHandTitle}`
	              : baseTitle;

	const baseDescription = "A simple website to calculate minerals required for alloy compositions!";
	const description = alloyName
	                    ? `Calculate the mineral requirements for ${alloyName}.`
	                    : baseDescription;

	return {
		title,
		description,
		openGraph : {
			title,
			description,
			url : "https://tfc-calculator.devmarcel.net/",
			siteName : "TerraFirmaCraft Alloy Calculator",
			images : [
				{
					url : "/api/og",
					width : 1200,
					height : 630,
					alt : "TFC Alloy Calculator Cover"
				}
			],
			locale : "en_US",
			type : "website"
		},
		twitter : {
			card : "summary_large_image",
			title,
			description,
			images : ["/api/og"]
		}
	};
}

export default function VersionLayout(
		{
			children
		} : {
			children : React.ReactNode;
			params : ParamProps;
		}) {
	return children;
}