import { BaseManager } from "../../../core/manager/BaseManager";
import { SucklessBot } from "../../../core/SucklessBot";
import { MusicPlayer } from "./MusicPlayer";

/**
 * Music manager instance
 *
 * @export
 * @class MusicManager
 * @extends {BaseManager}
 */
export class MusicManager extends BaseManager {
	/**
	 * MusicPlayer sessions for this manager
	 *
	 * @private
	 * @type {MusicPlayer[]}
	 * @memberof MusicManager
	 */
	private __sessions: MusicPlayer[] = [];

	/**
	 * Add a music session to this manager
	 *
	 * @param {MusicPlayer} session
	 * @memberof MusicManager
	 */
	public add(session: MusicPlayer): void {
		this.__sessions.push(session);

		// debug
		this.__bot?.emit("debug", `[MusicManager] Added MusicPlayer #${session.id} to the list`);
	}

	/**
	 * Remove a music session from this manager
	 *
	 * @param {MusicPlayer} session
	 * @memberof MusicManager
	 */
	public remove(session: MusicPlayer): void {
		this.__sessions.splice(this.__sessions.indexOf(session), 1);

		// debug
		this.__bot?.emit("debug", `[MusicManager] Removed MusicPlayer #${session.id} from the list`);
	}

	/**
	 * Get on or all music sessions from this manager
	 *
	 * @param {string} [id]
	 * @return {*}  {MusicPlayer[]}
	 * @memberof MusicManager
	 */
	public getSession(id?: string): MusicPlayer[] {
		return id ? [this.__sessions.find((session) => session.id.includes(id))] : this.__sessions;
	}
}
