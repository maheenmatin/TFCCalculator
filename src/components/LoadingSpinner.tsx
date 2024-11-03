import React from "react";


interface LoadingSpinnerProps {
	fullScreen? : boolean;
	className? : string;
}

export function LoadingSpinner({className, fullScreen} : Readonly<LoadingSpinnerProps>) {
	return (
			<div className={`flex justify-center items-center ${fullScreen ? "min-h-screen" : ""}`}>
				<div
						className={`
						${className}
						animate-spin rounded-full h-12 w-12
						border-t-2 border-b-2 border-teal-100`}
				/>
			</div>
	);
}
