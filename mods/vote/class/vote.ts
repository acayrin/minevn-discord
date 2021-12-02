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
import { Bot } from "../../../core/class/bot";

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
     * This Bot instance related to this vote
     *
     * @type {Bot}
     * @memberof Vote
     */
    protected bot: Bot = undefined;

    /**
     * Amount of YES votes
     *
     * @type {number}
     * @memberof Vote
     */
    protected vote_Y: number = 0;

    /**
     * Amount of NO votes
     *
     * @type {number}
     * @memberof Vote
     */
    protected vote_N: number = 0;

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
    protected embed = new MessageEmbed()
        .setTimestamp()
        .setColor("#ed2261")
        .setTitle(`Vote`)
        .setDescription(`Voting ends in ${this.timer}s`)
        .setFooter("i love democracy");

    /**
     * Creates an instance of Vote.
     * @param {GuildMember} target User to mute
     * @param {(TextChannel | any)} channel Base text channel
     * @param {Bot} bot Bot instance
     * @param {any} options vote options
     * @memberof Vote
     */
    constructor(
        target: GuildMember,
        channel: TextChannel | any,
        bot: Bot,
        options?: { reason?: string; timer?: number }
    ) {
        voteMgr.add(this);
        this.bot = bot;
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
        this.onEnd().finally(() => voteMgr.remove(this));
    }

    /**
     * Triggers when a user casts their vote (Local)
     *
     * @private
     * @memberof Vote
     */
    private __onCollect(react: MessageReaction) {
        this.onCollect(react);
    }

    /**
     * Triggers when a user removes their vote (Local)
     *
     * @private
     * @memberof Vote
     */
    private __onRemove(react: MessageReaction) {
        this.onRemove(react);
    }

    /**
     * Get the target of this vote
     *
     * @return {*}  {Promise<GuildMember>} Member to be voted
     * @memberof Vote
     */
    protected async getTarget(id?: string): Promise<GuildMember> {
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
    protected async run(options?: { embed?: MessageEmbed }) {
        if (await this.preload()) return;

        if (this.bot.debug)
            this.bot.logger.debug(
                `[Vote - ${this.id}] A vote has started, target: ${this.target}`
            );

        this.msg = await this.channel.send({
            embeds: [options.embed || this.embed],
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
    protected async preload(): Promise<any> {
        // your code here
    }

    /**
     * Triggers when a user casts their vote
     *
     * @param {MessageReaction} react
     * @memberof Vote
     */
    protected async onCollect(react: MessageReaction) {
        if ("👍".includes(react.emoji.name)) this.vote_Y++;
        if ("👎".includes(react.emoji.name)) this.vote_N++;
    }

    /**
     * Triggers when a user retracts their vote
     *
     * @param {MessageReaction} react
     * @memberof Vote
     */
    protected async onRemove(react: MessageReaction) {
        if ("👍".includes(react.emoji.name)) this.vote_Y--;
        if ("👎".includes(react.emoji.name)) this.vote_N--;
    }

    /**
     * Triggers when the vote ends
     *
     * @memberof Vote
     */
    protected async onEnd() {
        if (this.bot.debug)
            this.bot.logger.debug(
                `[Vote - ${this.id}] Vote ended with ${this.vote_Y}:${
                    this.vote_N
                } (total ${this.vote_Y + this.vote_N})`
            );

        if (this.vote_Y > this.vote_N) this.onWin();
        else this.onLose();
    }

    /**
     * Triggers when the vote ended as win (Yes > No)
     *
     * @memberof Vote
     */
    protected async onWin() {
        this.msg.edit({
            embeds: [
                this.embed
                    .setTitle(`Vote ended, someone was abused`)
                    .setDescription(
                        `amount ${this.vote_Y} 👍 : ${this.vote_N} 👎`
                    ),
            ],
        });
    }

    /**
     * Triggers when the vote ended as lose (No > Yes)
     *
     * @memberof Vote
     */
    protected async onLose() {
        this.msg.edit({
            embeds: [
                this.embed
                    .setTitle(`Vote ended, nobody was abused`)
                    .setDescription(
                        `amount ${this.vote_Y} 👍 : ${this.vote_N} 👎`
                    ),
            ],
        });
    }
}

export { Vote };
