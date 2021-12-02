import { Bot } from "../../../core/class/bot";
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
    private sessions: Vote[] = [];

    /**
     * The Bot instance related to this manager
     *
     * @private
     * @type {Bot}
     * @memberof VoteManager
     */
    private bot: Bot = undefined;

    // empty
    constructor(bot?: Bot) {
        this.bot = bot;
    }

    /**
     * Add a vote session to this manager
     *
     * @param {Vote} session
     * @memberof VoteManager
     */
    public add(session: Vote): void {
        this.sessions.push(session);

        // debug
        if (this.bot && this.bot.debug)
            this.bot.logger.debug(
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
        this.sessions.splice(this.sessions.indexOf(session), 1);

        // debug
        if (this.bot && this.bot.debug)
            this.bot.logger.debug(
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
            return [this.sessions.find((session) => session.id.includes(id))];
        }
        return this.sessions;
    }
}

export { VoteManager };
