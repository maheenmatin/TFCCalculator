import React from "react";


export default function VersionLayout(
		{
			children,
		} : {
			children : React.ReactNode;
			params : {
				version : string;
				alloy? : string
			};
		}) {
	return children;
}