import React from "react";
import type {Metadata} from "next";
import {capitaliseFirstLetterOfEachWord} from "@/functions/utils";


type ParamProps = {
	params : {
		type : string;
		id : string;
		version : string;
		metal? : string
	};
};

export async function generateMetadata({params} : ParamProps) : Promise<Metadata> {
	const metalName = params.metal
	                  ? capitaliseFirstLetterOfEachWord(params.metal)
	                  : null;

	const baseTitle = "TerraFirmaCraft Metal Calculator";
	const shortHandTitle = "TFC Metal Calculator";
	const title = metalName
	              ? `${metalName} - ${shortHandTitle}`
	              : baseTitle;

	const baseDescription = "A simple website to calculate minerals required for metal compositions!";
	const description = metalName
	                    ? `Calculate the mineral requirements for ${metalName}.`
	                    : baseDescription;

	return {
		title,
		description,
		openGraph : {
			title,
			description,
			url : "https://tfc-calculator.devmarcel.net/",
			siteName : "TerraFirmaCraft Metal Calculator",
			images : [
				{
					url : "/api/og",
					width : 1200,
					height : 630,
					alt : "TFC Metal Calculator Cover"
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
			params : Promise<ParamProps>;
		}) {
	return children;
}