/* eslint-disable @typescript-eslint/no-explicit-any */
import Eris from 'eris';

import { generateID } from '../../../../core/utils/unique';
import Yujin from '../../../../core/yujin';
import { voteMgr } from '../VoteSombody';

/**
 * A Vote instance, to mute anyone
 *
 * @class Vote
 */
export abstract class Vote {
	/**
	 * The target user ID
	 *
	 * @type {Eris.Member}
	 * @memberof Vote
	 */
	target: Eris.Member = undefined;

	/**
	 * The vote owner user ID
	 *
	 * @type {Eris.Member}
	 * @memberof Vote
	 */
	owner: Eris.Member = undefined;

	/**
	 * The text channel that the vote is held
	 *
	 * @type {Eris.TextChannel}
	 * @memberof Vote
	 */
	channel: Eris.TextChannel = undefined;

	/**
	 * The guild that the vote is in
	 *
	 * @type {Eris.Guild}
	 * @memberof Vote
	 */
	guild: Eris.Guild = undefined;

	/**
	 * The message that triggered the vote
	 *
	 * @type {Eris.Message}
	 * @memberof Vote
	 */
	msg: Eris.Message = undefined;

	/**
	 * This mod instance related to this vote
	 *
	 * @protected
	 * @type {Yujin.Mod}
	 * @memberof Vote
	 */
	protected _mod: Yujin.Mod = undefined;

	/**
	 * Amount of YES votes
	 *
	 * @protected
	 * @type {number}
	 * @memberof Vote
	 */
	protected _vote_Y: number = 0;

	/**
	 * Amount of NO votes
	 *
	 * @protected
	 * @type {number}
	 * @memberof Vote
	 */
	protected _vote_N: number = 0;

	/**
	 * Emoji settings
	 *
	 * @protected
	 * @memberof Vote
	 */
	protected _emojis = {
		yes: {
			identifier: '',
			include: '👍',
		},
		no: {
			identifier: '',
			include: '👎',
		},
	};

	/**
	 * Reason for this vote
	 *
	 * @type {string}
	 * @memberof Vote
	 */
	reason: string = 'mob vote';

	/**
	 * Duration of this vote
	 *
	 * @type {number}
	 * @memberof Vote
	 */
	timer: number = 30;

	/**
	 * The ID of this vote
	 *
	 * @type {string}
	 * @returns {string} id string
	 * @memberof Vote
	 */
	id: string = generateID();

	/**
	 * The message embed for this vote
	 *
	 * @returns {Eris.Embed}
	 * @memberof Vote
	 */
	protected _embed: Eris.Embed;

	/**
	 * Mod configuration
	 *
	 * @protected
	 * @type {*}
	 * @memberof Vote
	 */
	protected _config: any = {};

	/**
	 * Mod datastore
	 *
	 * @protected
	 * @type {Yujin.Datastore}
	 * @memberof Vote
	 */
	protected _datastore: Yujin.Datastore;

	/**
	 * Creates an instance of Vote.
	 * @memberof Vote
	 */
	constructor(o: {
		target: Eris.Member;
		owner: Eris.Member;
		channel: Eris.TextChannel | any;
		mod: Yujin.Mod;
		reason?: string;
		timer?: number;
	}) {
		voteMgr.add(this);

		this._mod = o.mod;
		this._config = o.mod.getConfig();
		this._datastore = o.mod.getDatastore();
		this.channel = o.channel;
		this.guild = o.channel.guild;
		this.target = o.target;
		this.owner = o.owner;
		if (o.reason) this.reason = o.reason;
		if (o.timer) this.timer = o.timer;

		this._embed = new Eris.Embed()
			.setTimestamp()
			.setColor(this._mod.bot.color)
			.setTitle('Vote')
			.setDescription(`Voting ends in ${this.timer}s`)
			.setFooter('i love bullying');

		const emoji_yes = o.mod.bot.client.getEmoji(this._config.emojis?.yes).shift();
		const emoji_no = o.mod.bot.client.getEmoji(this._config.emojis?.no).shift();
		if (emoji_yes) {
			this._emojis.yes.identifier = emoji_yes.getIdentifier();
			this._emojis.yes.include = emoji_yes.toString();
		}
		if (emoji_no) {
			this._emojis.no.identifier = emoji_no.getIdentifier();
			this._emojis.no.include = emoji_no.toString();
		}
	}

	/**
	 * Remove this vote session from the vote manager when it ends (Local)
	 *
	 * @return {*} void
	 * @memberof Vote
	 */
	#onEnd(): void {
		this._onEnd().finally(() => voteMgr.remove(this));
	}

	/**
	 * Get the target of this vote
	 *
	 * @return {*}  {Promise<Member>} Member to be voted
	 * @memberof Vote
	 */
	protected async _getTarget(id?: string): Promise<Eris.Member> {
		return this.guild.members.get(id || this.target.id);
	}

	// ================================== Editable parts ==================================

	/**
	 * Start the vote
	 *
	 * @protected
	 * @param {{
	 * 		embed?: Eris.EmbedOptions;
	 * 	}} [options] options to the vote, mainly message embed
	 * @return {*}  {Promise<void>}
	 * @memberof Vote
	 */
	protected async _run(options?: { embed?: Eris.EmbedOptions }): Promise<void> {
		if (await this._preload()) return;

		this.msg = await this.channel.createMessage({
			embed: options.embed || this._embed,
		});
		this.msg.addReaction(this._emojis.yes.identifier);
		this.msg.addReaction(this._emojis.no.identifier);

		setTimeout(() => this.#onEnd(), this.timer * 1e3);
	}

	/**
	 * Triggers before the vote starts
	 *
	 * @protected
	 * @return {*}  {Promise<any>}
	 * @memberof Vote
	 */
	protected async _preload(): Promise<any> {
		// your code here
	}

	/**
	 * Triggers when the vote ends
	 *
	 * @protected
	 * @return {*}  {Promise<void>}
	 * @memberof Vote
	 */
	protected async _onEnd(): Promise<void> {
		for (const user of await this.msg.getReaction(this._emojis.yes.identifier)) {
			if (!user.bot && user.id !== this.owner.id) this._vote_Y++;
		}
		for (const user of await this.msg.getReaction(this._emojis.no.identifier)) {
			if (!user.bot && user.id !== this.owner.id) this._vote_N++;
		}

		if (this._vote_Y > this._vote_N) this._onWin();
		else this._onLose();
	}

	/**
	 * Triggers when the vote ended as win (Yes > No)
	 *
	 * @protected
	 * @return {*}  {Promise<void>}
	 * @memberof Vote
	 */
	protected async _onWin(): Promise<void> {
		this.msg.edit({
			embed: this._embed
				.setTitle('Vote ended, someone was abused')
				.setDescription(
					`amount ${this._vote_Y} ${this._emojis.yes.include} : ${this._vote_N} ${this._emojis.no.include}`,
				),
		});
	}

	/**
	 * Triggers when the vote ended as lose (No > Yes)
	 *
	 * @protected
	 * @return {*}  {Promise<void>}
	 * @memberof Vote
	 */
	protected async _onLose(): Promise<void> {
		this.msg.edit({
			embed: this._embed
				.setTitle('Vote ended, nothing happened, you saw nothing')
				.setDescription(
					`amount ${this._vote_Y} ${this._emojis.yes.include} : ${this._vote_N} ${this._emojis.no.include}`,
				),
		});
	}
}
