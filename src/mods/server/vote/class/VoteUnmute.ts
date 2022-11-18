/* eslint-disable no-mixed-spaces-and-tabs */
import { Vote } from './Vote';

export class VoteUnmute extends Vote {
	/**
	 * Override base vote run phase
	 *
	 * @return {*}  {Promise<void>}
	 * @memberof VoteMute
	 */
	async vote(): Promise<void> {
		this._run({ embed: this._embed.setTitle(`Unmute: ${this.target.tag()}`) });
	}

	/**
	 * Triggers when the vote ended as win (Yes > No)
	 *
	 * @memberof VoteUnmute
	 */
	protected async _onWin(): Promise<void> {
		const role = this.guild.getRole(this._config.muted_role || 'mute');

		this.msg.edit({
			embed: this._embed
				.setTitle(`Unmuted: ${this.target.tag()}`)
				.setDescription(
					`reason: ${this.reason}\namount ${this._vote_Y} ${this._emojis.yes.include} : ${this._vote_N} ${this._emojis.no.include}`,
				),
		});

		const job = !this._config.use_timeout
			? this.target.removeRole(role.id)
			: this.target.edit({
					communicationDisabledUntil: undefined,
			  });
		job.catch((e) => {
			this.msg.reply(`I failed to set **${this.target.tag()}** free (err: ${e})`);
		});
	}
}
