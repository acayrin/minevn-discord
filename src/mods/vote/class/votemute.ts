import { getRole } from "../../../core/utils";
import * as recentmutes from "../recentmute";
import { Vote } from "./vote";

/**
 * Vote mute instance, extends from Vote
 *
 * @export
 * @class VoteMute
 * @extends {Vote}
 */
export class VoteMute extends Vote {
	/**
	 * Override base vote run phase
	 *
	 * @return {*}  {Promise<void>}
	 * @memberof VoteMute
	 */
	async vote(): Promise<void> {
		this._run({
			embed: this._embed().setTitle(`Mute: ${this.target.user.tag} for ${this._bot.config.mute.duration}m`),
		});
	}

	/**
	 * Triggers when the vote ended as win (Yes > No)
	 *
	 * @memberof Vote
	 */
	protected async _onWin(): Promise<any> {
		const role = await getRole(this._bot.config.mute.role || "mute", this.channel.guild);

		this.msg.edit({
			embeds: [
				this._embed()
					.setTitle(`Muted: ${this.target.user.tag} [${this._bot.config.mute.duration}m]`)
					.setDescription(`reason: ${this.reason}\namount ${this._vote_Y} 👍 : ${this._vote_N} 👎`),
			],
		});
		this.target.roles
			.add(role)
			.catch((e) => {
				// user left server before the vote ends
				return this.channel.send(
					`User **${this.target.user.tag}** can't be abused cuz they ran away like a wimp`
				);
			})
			.then(() => {
				// recent mute
				// remove after 2x[mute duration] (1x to equals the mute duration, 2x is the main cooldown)
				recentmutes.add(this.target.id);
				setTimeout(() => {
					recentmutes.remove(this.target.id);
				}, this._bot.config.mute.duration * 3 * 60000);

				// only when the user is still in the server
				// remove role after timeout
				setTimeout(async () => {
					if (this.target.roles.cache.has(role.id)) {
						this.target.roles
							.remove(role)
							.then(() => {
								// debug
								if (this._bot.debug)
									this._bot.logger.debug(`[Vote - ${this.id}] Unmuted user ${this.target.id}`);
							})
							.catch((e) => {
								this._bot.logger.debug(
									`[Vote - ${this.id}] Can't remove muted role from user ${this.target.id}, error ${e}`
								);
							});
					} else {
						if (this._bot.debug)
							this._bot.logger.debug(
								`[Vote - ${this.id}] User ${this.target.id} got their muted role removed, ignoring`
							);
					}
				}, this._bot.config.mute.duration * 60000);
			});
	}
}
