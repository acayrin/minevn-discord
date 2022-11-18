/**
 * String comparison, from https://github.com/aceakash/string-similarity/
 *
 * @export
 * @param {string} first first string
 * @param {string} second second string
 * @return {number} difference in range of 0-1
 */
export function compareTwoStrings(first: string, second: string): number {
	first = first.replace(/\s+/g, "");
	second = second.replace(/\s+/g, "");

	if (first === second) return 1; // identical or empty
	if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

	const firstBigrams = new Map();
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2);
		const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

		firstBigrams.set(bigram, count);
	}

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

/**
 * String comparison, from 2
 *
 * @export
 * @param {string} a first string
 * @param {string} b second string
 * @return {*}  {number} difference, in range of 0-1
 */
export function compareTwoStrings2(a: string, b: string): number {
	let equivalency = 0;
	const minLength = a.length > b.length ? b.length : a.length;
	const maxLength = a.length < b.length ? b.length : a.length;
	for (let i = 0; i < minLength; i++) {
		if (a[i] == b[i]) {
			equivalency++;
		}
	}

	const weight = equivalency / maxLength;
	return weight;
}
