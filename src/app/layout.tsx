import "@/styles/globals.css";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react";
import type {Metadata} from "next";
import React from "react";


export const metadata : Metadata = {
	title : "TerraFirmaGreg Alloy Calculator",
	description : "Calculate alloy recipes for TerraFirmaGreg"
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