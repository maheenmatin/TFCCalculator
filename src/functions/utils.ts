export function capitaliseFirstLetterOfEachWord(input : string) : string {
	if (!input) {
		return input;
	}

	return input
			.split(/[ _]+/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
}

export function replaceUnderscoreWithSpace(input : string) : string {
	if (!input) {
		return input;
	}

	return input
			.split(/[ _]+/)
			.join(" ");
}
