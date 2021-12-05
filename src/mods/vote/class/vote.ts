import * as crypto from "crypto";
import {
	Guild,
	GuildMember,
	Message,
	MessageEmbed,
	MessageReaction,
	TextChannel,
	User,
} from "discord.js";
import { voteMgr } from "..";
import { SucklessBot } from "../../../core/class/sucklessbot";

/**
 * A Vote instance, to mute anyone
 *
 * @class Vote
 */
class Vote {
	/**
	 * The target user ID
	 *
	 * @type {GuildMember}
	 * @memberof Vote
	 */
	public target: GuildMember = undefined;

	/**
	 * The text channel that the vote is held
	 *
	 * @type {TextChannel}
	 * @memberof Vote
	 */
	public channel: TextChannel = undefined;

	/**
	 * The guild that the vote is in
	 *
	 * @type {Guild}
	 * @memberof Vote
	 */
	public guild: Guild = undefined;

	/**
	 * The message that triggered the vote
	 *
	 * @type {Message}
	 * @memberof Vote
	 */
	public msg: Message = undefined;

	/**
	 * This SucklessBot instance related to this vote
	 *
	 * @type {SucklessBot}
	 * @memberof Vote
	 */
	protected _bot: SucklessBot = undefined;

	/**
	 * Amount of YES votes
	 *
	 * @type {number}
	 * @memberof Vote
	 */
	protected _vote_Y: number = 0;

	/**
	 * Amount of NO votes
	 *
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
	 * @memberof Vote
	 */
	public id = crypto
		.createHash("md5")
		.update(Date.now().toString(), "utf-8")
		.digest("hex")
		.slice(0, 7);

	/**
	 * The message embed for this vote
	 *
	 * @memberof Vote
	 */
	protected _embed(): MessageEmbed {
		return new MessageEmbed()
			.setTimestamp()
			.setColor("#ed2261")
			.setTitle(`Vote`)
			.setDescription(`Voting ends in ${this.timer}s`)
			.setFooter("i love democracy");
	}

	/**
	 * Creates an instance of Vote.
	 * @param {GuildMember} target User to mute
	 * @param {(TextChannel | any)} channel Base text channel
	 * @param {SucklessBot} bot SucklessBot instance
	 * @param {any} options vote options
	 * @memberof Vote
	 */
	constructor(
		target: GuildMember,
		channel: TextChannel | any,
		bot: SucklessBot,
		options?: { reason?: string; timer?: number }
	) {
		voteMgr.add(this);
		this._bot = bot;
		this.channel = channel;
		this.guild = channel.guild;
		this.target = target;
		if (options) {
			if (options.reason) this.reason = options.reason;
			if (options.timer) this.timer = options.timer;
		}
	}

	/**
	 * Remove this vote session from the vote manager when it ends (Local)
	 *
	 * @private
	 * @memberof Vote
	 */
	private __onEnd() {
		this._onEnd().finally(() => voteMgr.remove(this));
	}

	/**
	 * Triggers when a user casts their vote (Local)
	 *
	 * @private
	 * @memberof Vote
	 */
	private __onCollect(react: MessageReaction) {
		this._onCollect(react);
	}

	/**
	 * Triggers when a user removes their vote (Local)
	 *
	 * @private
	 * @memberof Vote
	 */
	private __onRemove(react: MessageReaction) {
		this._onRemove(react);
	}

	/**
	 * Get the target of this vote
	 *
	 * @return {*}  {Promise<GuildMember>} Member to be voted
	 * @memberof Vote
	 */
	protected async _getTarget(id?: string): Promise<GuildMember> {
		return await this.guild.members.fetch({
			user: id || this.target.id,
			cache: false,
		});
	}

	// ================================== Editable parts ==================================

	/**
	 * Start the vote
	 *
	 * @memberof Vote
	 */
	protected async _run(options?: { embed?: MessageEmbed }) {
		if (await this._preload()) return;

		if (this._bot.debug)
			this._bot.logger.debug(
				`[Vote - ${this.id}] A vote has started, target: ${this.target.id}`
			);

		this.msg = await this.channel.send({
			embeds: [options.embed || this._embed()],
		});
		await this.msg.react("👍");
		await this.msg.react("👎");

		this.msg
			.createReactionCollector({
				filter: (r: MessageReaction, u: User) =>
					["👍", "👎"].includes(r.emoji.name) && !u.bot,
				time: this.timer * 1000,
				dispose: true,
			})
			.on("collect", this.__onCollect.bind(this))
			.on("remove", this.__onRemove.bind(this))
			.on("end", this.__onEnd.bind(this));
	}

	/**
	 * Triggers before the vote starts
	 *
	 * @memberof Vote
	 */
	protected async _preload(): Promise<any> {
		// your code here
	}

	/**
	 * Triggers when a user casts their vote
	 *
	 * @param {MessageReaction} react
	 * @memberof Vote
	 */
	protected async _onCollect(react: MessageReaction) {
		if ("👍".includes(react.emoji.name)) this._vote_Y++;
		if ("👎".includes(react.emoji.name)) this._vote_N++;
	}

	/**
	 * Triggers when a user retracts their vote
	 *
	 * @param {MessageReaction} react
	 * @memberof Vote
	 */
	protected async _onRemove(react: MessageReaction) {
		if ("👍".includes(react.emoji.name)) this._vote_Y--;
		if ("👎".includes(react.emoji.name)) this._vote_N--;
	}

	/**
	 * Triggers when the vote ends
	 *
	 * @memberof Vote
	 */
	protected async _onEnd() {
		if (this._bot.debug)
			this._bot.logger.debug(
				`[Vote - ${this.id}] Vote ended with ${this._vote_Y}:${
					this._vote_N
				} (total ${this._vote_Y + this._vote_N})`
			);

		if (this._vote_Y > this._vote_N) this._onWin();
		else this._onLose();
	}

	/**
	 * Triggers when the vote ended as win (Yes > No)
	 *
	 * @memberof Vote
	 */
	protected async _onWin() {
		this.msg.edit({
			embeds: [
				this._embed()
					.setTitle(`Vote ended, someone was abused`)
					.setDescription(
						`amount ${this._vote_Y} 👍 : ${this._vote_N} 👎`
					),
			],
		});
	}

	/**
	 * Triggers when the vote ended as lose (No > Yes)
	 *
	 * @memberof Vote
	 */
	protected async _onLose() {
		this.msg.edit({
			embeds: [
				this._embed()
					.setTitle(`Vote ended, nobody was abused`)
					.setDescription(
						`amount ${this._vote_Y} 👍 : ${this._vote_N} 👎`
					),
			],
		});
	}
}

export { Vote };
