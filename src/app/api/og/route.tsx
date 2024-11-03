import {ImageResponse} from "next/og";


export const runtime = "edge";

export async function GET() {
	return new ImageResponse(
			(
					<div
							style={{
								display : "flex",
								background : "#f6f6f6",
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
									gap : "24px"
								}}
						>
							<div
									style={{
										display : "flex",
										imageRendering : "pixelated",
										width : "256px",
										height : "256px"
									}}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
										src="https://tfg-calculator.vercel.app/favicon.ico"
										alt="TFC Alloy Calculator Logo"
										width={"256"}
										height={"256"}
										style={{
											imageRendering : "pixelated"
										}}
								/>
							</div>
							<h1
									style={{
										fontSize : "64px",
										color : "#333"
									}}
							>
								TerraFirmaCraft Alloy Calculator
							</h1>
							<p
									style={{
										fontSize : "32px",
										color : "#666"
									}}
							>
								A simple website to calculate minerals required for alloy compositions!
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