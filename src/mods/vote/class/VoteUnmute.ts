import { getRole } from "../../../core/utils";
import { Vote } from "./Vote";

export class VoteUnmute extends Vote {
	/**
	 * Override base vote run phase
	 *
	 * @return {*}  {Promise<void>}
	 * @memberof VoteMute
	 */
	async vote(): Promise<void> {
		this._run({
			embed: this._embed().setTitle(`Unmute: ${this.target.user.tag}`),
		});
	}

	/**
	 * Triggers when the vote ended as win (Yes > No)
	 *
	 * @memberof VoteUnmute
	 */
	protected async _onWin(): Promise<any> {
		const role = await getRole(this._bot.configs.get("vote.json")['role'] || "mute", this.channel.guild);

		this.msg.edit({
			embeds: [
				this._embed()
					.setTitle(`Unmuted: ${this.target.user.tag}`)
					.setDescription(`reason: ${this.reason}\namount ${this._vote_Y} 👍 : ${this._vote_N} 👎`),
			],
		});
		this.target.roles.remove(role).catch((e) => {
			this.channel.send(`I failed to set **${this.target.user.tag}** free (err: ${e})`);
		});
	}
}
