/* eslint-disable no-mixed-spaces-and-tabs */
import { Vote } from './Vote';

export class VoteMute extends Vote {
	/**
	 * Override base vote run phase
	 *`
	 * @return {*}  {Promise<void>}
	 * @memberof VoteMute
	 */
	async vote(): Promise<void> {
		const e = this._embed;
		e.title = `Mute: ${this.target.tag()} for ${this._config.duration}m`;

		this._run({ embed: e });
	}

	/**
	 * Triggers when the vote ended as win (Yes > No)
	 *
	 * @memberof Vote
	 */
	protected async _onWin(): Promise<void> {
		const role = this.guild.getRole(this._config.muted_role || 'mute');

		this.msg.edit({
			embed: this._embed
				.setTitle(`Muted: ${this.target.tag()} [${this._config.duration}m]`)
				.setDescription(
					`reason: ${this.reason}\namount ${this._vote_Y} ${this._emojis.yes.include} : ${this._vote_N} ${this._emojis.no.include}`,
				),
		});
		const job = !this._config.use_timeout
			? this.target.addRole(role.id)
			: this.target.edit({
					communicationDisabledUntil: new Date(Date.now() + this._config.duration * 60_000),
			  });
		job.then(() => {
			// recent mute
			// remove after 2x[mute duration] (1x to equals the mute duration, 2x is the main cooldown)
			this._datastore.set(
				{
					key: this.target.id,
					value: {
						endMute: Date.now() + this._config.duration * 60 * 1e3,
						endProtect: Date.now() + this._config.duration * 180 * 1e3,
					},
				},
				this.guild.id,
			);
		}).catch(() => {
			// user left server before the vote ends
			return this.msg.reply(`User **${this.target.tag()}** can't be abused cuz they ran away like a wimp`);
		});
	}
}
