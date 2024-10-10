import React from "react";

interface ErrorProps {
	error : Error | string | null;
}

export function ErrorComponent(props : ErrorProps) {
	const error = props.error;
	if (!error) return;

	return (
			<div className="bg-red-700 text-white text-center rounded-lg shadow p-6">
				<h2 className="text-xl font-bold mb-4">ERROR</h2>
				<p>{error instanceof Error ? error.message : error as string}</p>
				<div className="bg-white text-black rounded-lg mt-4">
					<h2 className="text-xl font-bold pt-4">Struggling?</h2>
					<p className="text-lg pt-2 p-4">
						If this issue persists,&nbsp;
						<a href="https://github.com/Supermarcel10/TFGCalculator/issues/new/choose" target="_blank" className="text-cyan-500"> open an issue </a>
						&nbsp;with a screenshot of the entire page; we&apos;ll investigate!
					</p>
				</div>
			</div>
	)
}
