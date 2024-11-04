import React from "react";


interface SelfCenteringGridProps<T> {
	elements : T[];
	perRow : {
		default : number;
		sm? : number;
		md? : number;
		lg? : number;
		xl? : number;
	};
	renderElement : (element : T, index : number) => React.ReactNode;
	className? : string;
}

export function SelfCenteringGrid<T>(
		{
			elements,
			perRow,
			renderElement,
			className = ""
		} : Readonly<SelfCenteringGridProps<T>>
) {
	const [currentPerRow, setCurrentPerRow] = React.useState(perRow.default);

	React.useEffect(() => {
		const getCurrentPerRow = () => {
			if (window.matchMedia("(min-width: 1280px)").matches && perRow.xl) {
				return perRow.xl;
			}
			if (window.matchMedia("(min-width: 1024px)").matches && perRow.lg) {
				return perRow.lg;
			}
			if (window.matchMedia("(min-width: 768px)").matches && perRow.md) {
				return perRow.md;
			}
			if (window.matchMedia("(min-width: 640px)").matches && perRow.sm) {
				return perRow.sm;
			}
			return perRow.default;
		};

		const updatePerRow = () => {
			setCurrentPerRow(getCurrentPerRow());
		};

		updatePerRow();
		window.addEventListener("resize", updatePerRow);
		return () => window.removeEventListener("resize", updatePerRow);
	}, [perRow]);

	const gridWSize = (100 / currentPerRow).toFixed(3);
	const remainingElements = elements.length % currentPerRow;
	const lastRowOffset = remainingElements === 0 ? 0 :
	                      ((currentPerRow - remainingElements) * parseFloat(gridWSize)) / 2;

	return (
			<div className={`${className} flex flex-wrap -mx-2`}>
				{elements.map((element, index) => {
					const isLastRow = Math.floor(index / currentPerRow) === Math.floor((elements.length - 1) / currentPerRow);
					const style : React.CSSProperties = {
						width : `${gridWSize}%`,
						padding : ".5rem .5rem"
					};

					if (isLastRow && remainingElements !== 0 && (index % currentPerRow) === 0) {
						style.marginLeft = `${lastRowOffset}%`;
					}

					return (
							<div
									key={JSON.stringify(element)}
									style={style}
							>
								{renderElement(element, index)}
							</div>
					);
				})}
			</div>
	);
}
