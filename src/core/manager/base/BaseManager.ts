import Yujin from '../../yujin';

/**
 * @description Base manager object
 * @author acayrin
 * @export
 * @abstract
 * @class BaseManager
 */
export abstract class BaseManager {
	/**
	 * @description Yujin Bot this object belongs to
	 * @author acayrin
	 * @protected
	 * @type {(Yujin.Bot | undefined)}
	 * @memberof BaseManager
	 */
	protected bot: Yujin.Bot | undefined;

	/**
	 * Creates an instance of BaseManager.
	 * @author acayrin
	 * @param {Yujin.Bot} [bot] bot instance
	 * @memberof BaseManager
	 */
	constructor(bot?: Yujin.Bot) {
		if (bot) this.bot = bot;
	}
}
