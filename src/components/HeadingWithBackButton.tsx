import React from "react";
import {CaretCircleLeft} from "@phosphor-icons/react";
import {useRouter} from "next/navigation";


interface HeadingWithButtonProps {
	title : string;
	ariaPreviousScreenName?: string;
	handleBackURI: string;
	className? : string;
}

export function HeadingWithBackButton({title, ariaPreviousScreenName, handleBackURI, className} : Readonly<HeadingWithButtonProps>) {
	const router = useRouter();

	const handleBack = () => {
		router.push(handleBackURI);
	};

	return (
			<div className={`${className} flex items-center mb-8`}>
				<button
						onClick={handleBack}
						className="mr-4"
						aria-label={`Return ${ariaPreviousScreenName ? `to ${ariaPreviousScreenName}` : ""}`}
				>
					<CaretCircleLeft
							size={40}
							weight="bold"
							className="text-primary text-teal-100 hover:text-teal-300 transition-colors duration-200"
							aria-hidden="true"
					/>
				</button>

				<h1 className="text-3xl font-bold text-primary flex-grow text-center">
					{title}
				</h1>

				<div className="w-10" aria-hidden="true"/>
			</div>
	);
}
