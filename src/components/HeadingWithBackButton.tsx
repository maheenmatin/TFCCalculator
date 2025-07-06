import React from "react";
import {CaretCircleLeftIcon} from "@phosphor-icons/react";
import {useRouter} from "next/navigation";


interface HeadingWithButtonProps {
	title : string;
 	subheading? : string;
	ariaPreviousScreenName? : string;
	handleBackURI : string;
	className? : string;
}

export function HeadingWithBackButton(
		{
			title,
			subheading,
			ariaPreviousScreenName,
			handleBackURI,
			className
		} : Readonly<HeadingWithButtonProps>) {
	const router = useRouter();

	const previousScreenName = ariaPreviousScreenName ? `to ${ariaPreviousScreenName}` : "";
	const ariaLabel = `Return ${previousScreenName}`;

	const handleBack = () => {
		router.push(handleBackURI);
	};

	return (
			<div className="mb-8">
				<div className={`${className} flex items-center`}>
					<button
							onClick={handleBack}
							className="mr-4"
							aria-label={ariaLabel}
					>
						<CaretCircleLeftIcon
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

				{subheading && <h2 className="text-sm text-gray-400 text-center">
					{subheading}
				</h2>}
			</div>
	);
}
