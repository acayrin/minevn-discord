import * as Discord from "discord.js";
import { voteMgr } from "..";
import { SucklessBot } from "../../../core/SucklessBot";
import { id } from "../../../core/utils/GenerateId";

/**
 * A Vote instance, to mute anyone
 *
 * @class Vote
 */
export abstract class Vote {
	/**
	 * The target user ID
	 *
	 * @type {GuildMember}
	 * @memberof Vote
	 */
	public target: Discord.GuildMember = undefined;

	/**
	 * The vote owner user ID
	 *
	 * @type {GuildMember}
	 * @memberof Vote
	 */
	public owner: Discord.GuildMember = undefined;

	/**
	 * The text channel that the vote is held
	 *
	 * @type {TextChannel}
	 * @memberof Vote
	 */
	public channel: Discord.TextChannel = undefined;

	/**
	 * The guild that the vote is in
	 *
	 * @type {Guild}
	 * @memberof Vote
	 */
	public guild: Discord.Guild = undefined;

	/**
	 * The message that triggered the vote
	 *
	 * @type {Message}
	 * @memberof Vote
	 */
	public msg: Discord.Message = undefined;

	/**
	 * This SucklessBot instance related to this vote
	 *
	 * @protected
	 * @type {SucklessBot}
	 * @memberof Vote
	 */
	protected _bot: SucklessBot = undefined;

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
	 * Reason for this vote
	 *
	 * @type {string}
	 * @memberof Vote
	 */
	public reason: string = "mob vote";

	/**
	 * Duration of this vote
	 *
	 * @type {number}
	 * @memberof Vote
	 */
	public timer: number = 30;

	/**
	 * The ID of this vote
	 *
	 * @type {string}
	 * @returns {string} id string
	 * @memberof Vote
	 */
	public id: string = id();

	/**
	 * The message embed for this vote
	 *
	 * @returns {Discord.MessageEmbed}
	 * @memberof Vote
	 */
	protected _embed(): Discord.MessageEmbed {
		return new Discord.MessageEmbed()
			.setTimestamp()
			.setColor(this._bot.configs.get("core.json")["color"])
			.setTitle(`Vote`)
			.setDescription(`Voting ends in ${this.timer}s`)
			.setFooter("i love democracy");
	}

	/**
	 * Creates an instance of Vote.
	 *
	 * @param {GuildMember} target User to mute
	 * @param {GuildMember} owner The owner of the vote
	 * @param {(TextChannel | any)} channel Base text channel
	 * @param {SucklessBot} bot SucklessBot instance
	 * @param {any} options vote options
	 * @memberof Vote
	 */
	constructor(
		target: Discord.GuildMember,
		owner: Discord.GuildMember,
		channel: Discord.TextChannel | any,
		bot: SucklessBot,
		options?: { reason?: string; timer?: number }
	) {
		voteMgr.add(this);
		this._bot = bot;
		this.channel = channel;
		this.guild = channel.guild;
		this.target = target;
		this.owner = owner;
		if (options) {
			if (options.reason) this.reason = options.reason;
			if (options.timer) this.timer = options.timer;
		}
	}

	/**
	 * Remove this vote session from the vote manager when it ends (Local)
	 *
	 * @private
	 * @return {*} void
	 * @memberof Vote
	 */
	private __onEnd(): void {
		this._onEnd().finally(() => voteMgr.remove(this));
	}

	/**
	 * Triggers when a user casts their vote (Local)
	 *
	 * @private
	 * @return {*} void
	 * @memberof Vote
	 */
	private __onCollect(react: Discord.MessageReaction): void {
		this._onCollect(react);
	}

	/**
	 * Triggers when a user removes their vote (Local)
	 *
	 * @private
	 * @return {*} void
	 * @memberof Vote
	 */
	private __onRemove(react: Discord.MessageReaction): void {
		this._onRemove(react);
	}

	/**
	 * Get the target of this vote
	 *
	 * @return {*}  {Promise<GuildMember>} Member to be voted
	 * @memberof Vote
	 */
	protected async _getTarget(id?: string): Promise<Discord.GuildMember> {
		return await this.guild.members.fetch({
			user: id || this.target.id,
			cache: false,
		});
	}

	// ================================== Editable parts ==================================

	/**
	 * Start the vote
	 *
	 * @protected
	 * @param {{
	 * 		embed?: Discord.MessageEmbed;
	 * 	}} [options] options to the vote, mainly message embed
	 * @return {*}  {Promise<void>}
	 * @memberof Vote
	 */
	protected async _run(options?: { embed?: Discord.MessageEmbed }): Promise<void> {
		if (await this._preload()) return;

		this._bot.emit("debug", `[Vote - ${this.id}] A vote has started, target: ${this.target.id}`);

		this.msg = await this.channel.send({
			embeds: [options.embed || this._embed()],
		});
		await this.msg.react("👍");
		await this.msg.react("👎");

		this.msg
			.createReactionCollector({
				filter: (r: Discord.MessageReaction, u: Discord.User) => ["👍", "👎"].includes(r.emoji.name) && !u.bot,
				time: this.timer * 1000,
				dispose: true,
			})
			.on("end", await this.__onEnd.bind(this));
		//.on("collect", await this.__onCollect.bind(this))
		//.on("remove", await this.__onRemove.bind(this))
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
	 * DEPRECATED
	 * Triggers when a user casts their vote
	 *
	 * @protected
	 * @param {Discord.MessageReaction} react user's reaction
	 * @return {*}  {Promise<void>}
	 * @memberof Vote
	 */
	protected async _onCollect(react: Discord.MessageReaction): Promise<void> {
		if ((await react.users.fetch()).first().id === this.owner.id) return;
		if ("👍".includes(react.emoji.name)) this._vote_Y++;
		if ("👎".includes(react.emoji.name)) this._vote_N++;
	}

	/**
	 * DEPRECATED
	 * Triggers when a user retracts their vote
	 *
	 * @protected
	 * @param {Discord.MessageReaction} react user's reaction
	 * @return {*}  {Promise<void>}
	 * @memberof Vote
	 */
	protected async _onRemove(react: Discord.MessageReaction): Promise<void> {
		if ((await react.users.fetch()).first().id === this.owner.id) return;
		if ("👍".includes(react.emoji.name)) this._vote_Y--;
		if ("👎".includes(react.emoji.name)) this._vote_N--;
	}

	/**
	 * Triggers when the vote ends
	 *
	 * @protected
	 * @return {*}  {Promise<void>}
	 * @memberof Vote
	 */
	protected async _onEnd(): Promise<void> {
		this.msg.reactions.cache.forEach((react) => {
			if ("👍".includes(react.emoji.name)) {
				react.users.cache.forEach((user) => {
					if (!user.bot && user.id !== this.owner.id) this._vote_Y++;
				});
			}
			if ("👎".includes(react.emoji.name)) {
				react.users.cache.forEach((user) => {
					if (!user.bot && user.id !== this.owner.id) this._vote_N++;
				});
			}
		});

		this._bot.emit(
			"debug",
			`[Vote - ${this.id}] Vote ended with ${this._vote_Y}:${this._vote_N} (total ${this._vote_Y + this._vote_N})`
		);

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
			embeds: [
				this._embed()
					.setTitle(`Vote ended, someone was abused`)
					.setDescription(`amount ${this._vote_Y} 👍 : ${this._vote_N} 👎`),
			],
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
			embeds: [
				this._embed()
					.setTitle(`Vote ended, nothing happened, you saw nothing`)
					.setDescription(`amount ${this._vote_Y} 👍 : ${this._vote_N} 👎`),
			],
		});
	}
}
