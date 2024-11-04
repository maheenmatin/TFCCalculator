import "@/styles/globals.css";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react";
import type {Metadata} from "next";
import React from "react";


export const metadata : Metadata = {
	title : "TerraFirmaCraft Alloy Calculator",
	description : "A simple website to calculate minerals required for alloy compositions!",
	openGraph : {
		title : "TerraFirmaCraft Alloy Calculator",
		description : "A simple website to calculate minerals required for alloy compositions!",
		url : "https:///tfg-calculator.vercel.app/",
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
		title : "TerraFirmaCraft Alloy Calculator",
		description : "A simple website to calculate minerals required for alloy compositions!",
		images: ['/api/og'],
	}
};

export default function RootLayout(
		{
			children
		} : Readonly<{
			children : React.ReactNode
		}>) {
	return (
			<html lang="en">
			<body>
			{children}
			<SpeedInsights/>
			<Analytics/>
			</body>
			</html>
	);
}