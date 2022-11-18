import Yujin from '../../../../core/yujin';

/**
 * A chat filter using Regexp
 *
 * @export
 * @class SoftFilter
 * @typedef {SoftFilter}
 */
export class SoftFilter {
	/**
	 * List of regex to use
	 *
	 * @type {RegExp[]}
	 */
	#list: RegExp[] = [];
	/**
	 * Normal emoji to use if total message length isn't over 2000
	 *
	 * @type {string}
	 */
	#emoji_normal: string;
	/**
	 * Fallback emoji to use when total message length is over 2000
	 *
	 * @type {string}
	 */
	#emoji_fallback: string;
	/**
	 * Base regex
	 *
	 * @type {string}
	 */
	#regtxt =
		'([^a-zA-Z0-9áÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬéÉèÈẻẺẽẼẹẸêÊếẾềỀểỂễỄệỆúÚùÙủỦũŨụỤưƯứỨừỪửỬữỮựỰóÓòÒỏỎõÕọỌôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢđĐíÍìÌỉỈĩĨịỊýÝỷỶỹỸỳỲỵ])*';

	/**
	 * Creates an instance of SoftFilter.
	 *
	 * @constructor
	 * @param {Yujin.Mod} mod
	 */
	constructor(mod: Yujin.Mod) {
		this.#emoji_normal = mod.getConfig().replace?.normal || '❌';
		this.#emoji_fallback = mod.getConfig().replace?.fallback || '❌';

		mod.getConfig().list.forEach((i: string) => {
			if (i.startsWith('!')) {
				// match any case
				this.#list.push(new RegExp(`(${i.substring(1).split('').join(this.#regtxt)})`, 'gmiu'));
				return; // doesnt need to add others
			}
			if (i.startsWith('$')) {
				// ignore exact-word only match
				i = i.substring(1);
			} else {
				// exact-word only match
				this.#list.push(new RegExp(i, 'gmiu'));
			}
			// match most cases but except exact-word (default)
			this.#list.push(new RegExp(`\\b(${i.split('').join(this.#regtxt)})\\1*\\b`, 'gmiu'));
		});
	}

	/**
	 * Filter the message and return new message
	 *
	 * @async
	 * @param {string} msg
	 * @returns {Promise<string>}
	 */
	async filter(msg: string): Promise<string> {
		const emotes: Map<string, string> = new Map();
		msg.match(/(<a?):\w+:(\d{18}>)/gimu)?.forEach((match) => {
			// if emotes not already exist
			if (!emotes.has(match)) {
				const rep = `%%${Math.random()}%%`;
				emotes.set(match, rep);

				// replace all matching with replacement
				msg = msg.replaceAll(match, rep);
			}
		});

		await Promise.all(
			this.#list.map((reg) => {
				msg = msg.replace(reg, this.#emoji_normal);
			}),
		);

		for (const rep of emotes.keys()) {
			msg = msg.replaceAll(emotes.get(rep), rep);
		}

		return msg.length > 2000 ? msg.replace(new RegExp(this.#emoji_normal, 'gi'), this.#emoji_fallback) : msg;
	}
}
