import {ImageResponse} from "next/og";


export const runtime = "edge";

export async function GET() {
	return new ImageResponse(
			(
					<div
							style={{
								display : "flex",
								background : "#161616",
								color : "#D9FFF8",
								width : "1200px",
								height : "630px",
								alignItems : "center",
								justifyContent : "center",
								padding : "48px"
							}}
					>
						<div
								style={{
									display : "flex",
									flexDirection : "column",
									alignItems : "center",
								}}
						>
							<div
									style={{
										display: "flex",
										width: "256px",
										height: "256px",
										marginBottom: "24px",
									}}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
										src="https://tfc-calculator.devmarcel.net/img/icon/icon_256.png"
										alt="TFC Metal Calculator Logo"
								/>
							</div>
							<h1
									style={{
										fontSize : "68px",
										marginBottom: "-12px",
									}}
							>
								TerraFirmaCraft Metal Calculator
							</h1>
							<p
									style={{
										fontSize : "24px",
										color : "#84AFA7"
									}}
							>
								A simple website to calculate minerals required for metal compositions!
							</p>
						</div>
					</div>
			),
			{
				width : 1200,
				height : 630
			}
	);
}