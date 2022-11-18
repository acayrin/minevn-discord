const build_chart = (input: number[]) => {
	const res: string[] = [];
	const height = 5;

	const highest = list_highest(input);

	for (let y = height; y >= 1; y--) {
		let line = '';

		for (let x = 0; x < 18; x++) {
			const data = input[x] || 0;
			const percentage = Math.floor((data / highest) * 100);

			if (percentage >= y * (100 / height) - 5) {
				line += '█';
			} else {
				line += '░';
			}
		}

		res.push(line);
	}
	return res.join('\n');
};

const list_highest = (input: number[]): number => {
	let highest = input[0];
	for (const i of input) {
		if (i > highest) highest = i;
	}
	return highest;
};

const list_average = (input: number[]): number => {
	let total = 0;
	input.forEach((i) => (total += i));
	return Math.ceil(total / input.length);
};

export { build_chart, list_average, list_highest };
