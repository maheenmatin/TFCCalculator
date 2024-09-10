interface AlloyDisplayProps {
	alloy?: string;
}

export function AlloyComponentDisplay({ alloy }: Readonly<AlloyDisplayProps>) {
	return(
			<div className="text-primary">
				{/* Calculator content will be added here later */} <p>Calculator view for {alloy} - content to be added.</p>
			</div>
	);
}
