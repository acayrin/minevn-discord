import { SucklessBot } from "../sucklessbot";

/**
 * Base manager for things
 *
 * @export
 * @class BaseManager
 */
export class BaseManager {
	/**
	 * The SucklessBot instance this manager belongs to
	 *
	 * @private
	 * @type {SucklessBot}
	 * @memberof VoteManager
	 */
	protected __bot: SucklessBot = undefined;

	constructor(bot?: SucklessBot) {
		this.__bot = bot;
	}
}
