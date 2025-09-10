"use client";

import { GameVersionSelector } from "@/components/GameVersionSelector";
import { useEffect } from "react";
import GitHubButton from "react-github-btn";

export default function Home() {
	useEffect(() => {
		let last = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			document.documentElement.classList.toggle("scroll-down", y > last);
			document.documentElement.classList.toggle("scroll-up", y < last);
			last = y;
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<main
			className="container mx-auto"
			role="main"
			aria-label="Metal Calculator Home"
		>
			<div className="min-h-screen flex flex-col items-center">
				<div className="flex-1 flex items-center mt-16">
					<div className="text-center mx-auto">
						<h1 className="px-8 text-5xl font-bold text-teal-300 mb-8">
							TerraFirmaCraft Calculator
						</h1>
						<GameVersionSelector />
					</div>
				</div>
				<div className="flex mb-10">
					<svg className="transition-transform duration-300 ease-out [.scroll-down_&]:scale-y-[-1]" enable-background="new 0 0 48 48" height="48px" id="Layer_1" version="1.1" viewBox="0 0 48 48" width="24px" ><g id="Layer_4"><polygon fill="#46ecd5" points="47.993,14.121 45.872,12 45.863,12.009 43.752,9.896 24.008,29.641 4.248,9.881 0.007,14.125    0.013,14.13 0.009,14.134 21.679,35.803 21.664,35.816 23.967,38.119 23.98,38.105 23.994,38.119 25.021,37.093 25.029,37.104    47.993,14.141 47.982,14.131  "/></g></svg>
				</div>
			</div>

			<div className="text-center mx-auto mt-4 mb-12">
				<h3 className="text-2xl font-bold mb-5 text-teal-300">Introducing TFC Calculator!</h3>
				<div className="flex justify-center">
					<p className="text-xl max-w-prose">
						Designed to automatically, rapidly and accurately determine the required minerals for metal production 
						- unlike other calculators, TFC Calculator abstracts as much calculation work from the user 
						as possible.
					</p>
				</div>
			</div>

			<div className="text-center mx-auto mb-12">
				<h3 className="text-2xl font-bold mb-5 text-teal-300">Any Suggestions?</h3>
				<div className="flex justify-center">
					<p className="text-xl max-w-prose">
						For any suggestions, feature requests or bug reports, please create an{" "}
						<a
							href="https://github.com/Supermarcel10/TFGCalculator/issues/new/choose"
							target="_blank"
						>
							issue on GitHub
						</a>
					</p>
				</div>
			</div>

			<div className="flex flex-col items-center px-6 mb-20">
				<h3 className="text-2xl font-bold text-center mb-6 text-teal-300">Support the Project</h3>
				<div className="flex flex-row items-center justify-center gap-4">
					<GitHubButton
						href="https://github.com/sponsors/Supermarcel10"
						data-color-scheme="no-preference: light; light: dark; dark: light;"
						data-size="large"
						data-icon="octicon-heart"
						aria-label="Sponsor on GitHub">
						Sponsor
					</GitHubButton>
					<GitHubButton
						href="https://github.com/Supermarcel10/TFCCalculator"
						data-color-scheme="no-preference: light; light: dark; dark: light;"
						data-size="large"
						data-icon="octicon-star"
						data-show-count="true"
						aria-label="Star on GitHub">
						Star
					</GitHubButton>
				</div>
			</div>
		</main>
	);
}