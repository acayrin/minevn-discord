import { SucklessBot } from "../../../core/class/sucklessbot";
import { Vote } from "./vote";

/**
 * A Vote session manager
 *
 * @class VoteManager
 */
class VoteManager {
	/**
	 * Vote sessions for this manager
	 *
	 * @private
	 * @type {Vote[]}
	 * @memberof VoteManager
	 */
	private __sessions: Vote[] = [];

	/**
	 * The SucklessBot instance this manager belongs to
	 *
	 * @private
	 * @type {SucklessBot}
	 * @memberof VoteManager
	 */
	private __bot: SucklessBot = undefined;

	/**
	 * Creates an instance of VoteManager.
	 *
	 * @param {SucklessBot} [bot] The SucklessBot instance this manager belongs to
	 * @memberof VoteManager
	 */
	constructor(bot?: SucklessBot) {
		this.__bot = bot;
	}

	/**
	 * Add a vote session to this manager
	 *
	 * @param {Vote} session
	 * @memberof VoteManager
	 */
	public add(session: Vote): void {
		this.__sessions.push(session);

		// debug
		if (this.__bot && this.__bot.debug)
			this.__bot.logger.debug(
				`[VoteManager] Added Vote #${session.id} to the list`
			);
	}

	/**
	 * Remove a vote session from this manager
	 *
	 * @param {Vote} session
	 * @memberof VoteManager
	 */
	public remove(session: Vote): void {
		this.__sessions.splice(this.__sessions.indexOf(session), 1);

		// debug
		if (this.__bot && this.__bot.debug)
			this.__bot.logger.debug(
				`[VoteManager] Removed Vote #${session.id} from the list`
			);
	}

	/**
	 * Get on or all vote sessions from this manager
	 *
	 * @param {string} [id]
	 * @return {*}  {Vote[]}
	 * @memberof VoteManager
	 */
	public getSession(id?: string): Vote[] {
		if (id) {
			return [this.__sessions.find((session) => session.id.includes(id))];
		}
		return this.__sessions;
	}
}

export { VoteManager };
