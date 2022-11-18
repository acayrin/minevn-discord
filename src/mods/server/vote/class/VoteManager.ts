import { BaseManager } from '../../../../core/manager/base/BaseManager';
import Yujin from '../../../../core/yujin';
import { Vote } from './Vote';

/**
 * A Vote session manager
 *
 * @class VoteManager
 */
export class VoteManager extends BaseManager {
	/**
	 * Vote sessions for this manager
	 *
	 * @type {Vote[]}
	 * @memberof VoteManager
	 */
	#sessions: Vote[] = [];

	/**
	 * Creates an instance of VoteManager.
	 *
	 * @param {Yujin.Bot} [bot] The Yujin.Bot instance this manager belongs to
	 * @memberof VoteManager
	 */
	constructor(bot?: Yujin.Bot) {
		super(bot);
	}

	/**
	 * Add a vote session to this manager
	 *
	 * @param {Vote} session
	 * @returns {*}
	 * @memberof VoteManager
	 */
	add(session: Vote): void {
		this.#sessions.push(session);
	}

	/**
	 * Remove a vote session from this manager
	 *
	 * @param {Vote} session
	 * @returns {*}
	 * @memberof VoteManager
	 */
	remove(session: Vote): void {
		this.#sessions.splice(this.#sessions.indexOf(session), 1);
	}

	/**
	 * Get on or all vote sessions from this manager
	 *
	 * @param {string} [id]
	 * @return {*}  {Vote[]}
	 * @memberof VoteManager
	 */
	getSession(id?: string): Vote[] {
		if (id) {
			const g = this.#sessions.find((session) => session.id.includes(id));
			return g ? [g] : this.#sessions;
		} else {
			return this.#sessions;
		}
	}
}
