export function capitaliseFirstLetter(input : string) : string {
	return input[0].toUpperCase() + input.substring(1, input.length).toLowerCase();
}
