import { compareTwoStrings2 } from '../Utils';

export class HardFilter {
	#longest = 5;
	#list: string[] = [];
	#regex = new RegExp(
		/[a-zA-Z0-9]|[áÁàÀảẢãÃạẠ]|[ăĂắẮằẰẳẲẵẴặẶ]|[âÂấẤầẦẩẨẫẪậẬ]|[éÉèÈẻẺẽẼẹẸ]|[êÊếẾềỀểỂễỄệỆ]|[úÚùÙủỦũŨụỤ]|[ưƯứỨừỪửỬữỮựỰ]|[óÓòÒỏỎõÕọỌ]|[ôÔốỐồỒổỔỗỖộỘ]|[đĐ]|[íÍìÌỉỈĩĨịỊ]|[ýÝỷỶỹỸỳỲỵỴ]/gm,
	);
	#regexi = new RegExp(
		/[^[a-zA-Z0-9áÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬéÉèÈẻẺẽẼẹẸêÊếẾềỀểỂễỄệỆúÚùÙủỦũŨụỤưƯứỨừỪửỬữỮựỰóÓòÒỏỎõÕọỌôÔốỐồỒổỔỗỖộỘđĐíÍìÌỉỈĩĨịỊýÝỷỶỹỸỳỲỵ]/gm,
	);

	constructor(list: string[]) {
		this.#list = list;
		this.#list.forEach((s) => {
			if (this.#longest < Math.round(s.length / 2)) this.#longest = Math.round(s.length / 2);
		});
	}

	/**
	 * Remove illegals from string
	 * @param input message / string
	 * @returns fixed string
	 */
	clear(input: string): string {
		return input.replace(this.#regexi, '');
	}

	/**
	 * Advanced check (for short messages)
	 * @param msg message / string
	 * @returns fixed string
	 */
	async filter(msg: string): Promise<[string, number, number]> {
		// split into characters
		const split = msg.split('');
		// split into chunks of 10 chars
		const chunks = this.#to_chunk(split, this.#longest);
		// array of index ranges to remove from main string
		const indexes: number[][] = [];

		/**
		 *
		 * loop through chunks of characters
		 * - chunk: chunk of characters
		 * - ck_index: index of the chunk
		 *
		 */
		await Promise.all(
			chunks.map(async (chunk: string[], ck_index: number) => {
				// chunk's "real" index relative to the actual string
				const ck_base_index = chunks[0].length * ck_index;

				/**
				 *
				 * loop through characters of a chunk
				 * - char: current character of the chunk
				 * - cr_index: index of the character within the chunk (not relative index to main string)
				 *
				 */
				await Promise.all(
					chunk.map((char: string, cr_index: number) => {
						if (!char.match(this.#regex)) return;

						// char after current index
						let cf_index = cr_index;
						// overflow char of next chunk
						let oc_index = 0;
						// temp string for checking
						let tmp_string = char;

						here: while (++cf_index < chunk.length + this.#longest) {
							// get current char of chunk, if overflowed, use next chunk
							const cur: string =
								cf_index >= chunk.length && chunks[chunks.indexOf(chunk) + 1]
									? chunks[chunks.indexOf(chunk) + 1][oc_index++]
									: chunk[cf_index];

							// if current "next" char is undefined or doesn't match regex, skip
							if (!cur || !cur.match(this.#regex)) continue;

							// append to current string
							tmp_string += cur;

							let x = this.#list.length;
							while (--x) {
								// if the [removed symbols] string is 100% similar to one of the filter, execute next
								if (
									compareTwoStrings2(
										this.clear(tmp_string).toLowerCase(),
										this.#list[x].toLowerCase(),
									) >= 1
								) {
									// append to indexes
									indexes.push([
										ck_base_index + cr_index, // current index
										ck_base_index + cf_index, // starting string length
									]);

									// break
									break here; // break the outter loop
								}
							}
						}
					}),
				);
			}),
		);

		// split into characters
		const prt = msg.split('');

		// replace all
		for (const obj of indexes) {
			for (let c = obj[0]; c <= obj[1]; c++) {
				prt[c] = '';
				prt[obj[1]] = '是';
			}
		}

		// return
		const res = prt.join('');
		return [
			res.replace(/是/g, '<:mvncat:861078127551971338>').length < 1900
				? res.replace(/是/g, '<:mvncat:861078127551971338>') // :mvncat:
				: res.replace(/是/g, '🤡'),
			indexes.length,
			chunks.length,
		];
	}

	/**
	 * Split an array into chunks of wanted size
	 * @param arr array to split
	 * @param size chunk size
	 * @returns chunks
	 */
	#to_chunk(arr: string[], size: number): string[][] {
		if (size <= 0) throw 'Invalid chunk size';
		const R = [];
		for (let i = 0, len = arr.length; i < len; i += size) R.push(arr.slice(i, i + size));
		return R;
	}
}
