import * as crypto from "crypto"
import { GuildMember, Message, MessageEmbed, MessageReaction, TextChannel, User } from "discord.js"
import { Bot } from "../../bot"

/**
 * A Vote instance, to mute anyone
 *
 * @class Vote
 */
 class Vote {
    // variables, for internal uses
    target  : GuildMember = undefined
    channel : TextChannel = undefined
    msg     : Message     = undefined
    bot     : Bot         = undefined

    vote_Y  : number  = 0
    vote_N  : number  = 0
    reason  : string  = "mob vote"
    timer   : number  = 30
    id      = crypto.createHash('md5').update(Date.now().toString(), 'utf-8').digest('hex').slice(0, 7)

    embed = new MessageEmbed()
        .setTimestamp()
        .setColor('#ed2261')
        .setTitle(`Vote`)
        .setDescription(`Voting ends in ${this.timer}s`)
        .setFooter('i love democracy')

    /**
     * Creates an instance of Vote.
     * @param {GuildMember} target User to mute
     * @param {(TextChannel | any)} channel Base text channel
     * @param {Bot} bot Bot instance
     * @param {any} options vote options
     * @memberof Vote
     */
    constructor(target: GuildMember, channel: TextChannel | any, bot: Bot, options?: { reason?: string, timer?: number }) {
        this.bot     = bot
        this.target  = target
        this.channel = channel
        if (options) {
            this.reason  = options.reason
            this.timer   = options.timer
        }
    }

    /**
     * Start the vote
     *
     * @memberof Vote
     */
    async run(options?: { embed?: MessageEmbed }) {
        if (await this.preload()) return
    
        if (this.bot.debug)
            this.bot.logger.debug(`[Vote - ${this.id}] A vote has started, target: ${this.target.id}`)

        this.msg = await this.channel.send({ embeds: [
            options.embed || this.embed
        ] })
        await this.msg.react('👍')
        await this.msg.react('👎')

        this.msg.createReactionCollector({ 
            filter : (r: MessageReaction, u: User) => (['👍', '👎'].includes(r.emoji.name) && !u.bot), 
            time   : this.timer * 1000, 
            dispose: true 
        })
        .on('collect', this.onCollect.bind(this))
        .on('remove', this.onRemove.bind(this))
        .on('end', this.onEnd.bind(this))
    }

    /**
     * Triggers before the vote starts
     *
     * @memberof Vote
     */
    async preload(): Promise<any> {
        // your code here
    }

    /**
     * Triggers when a user casts their vote
     *
     * @param {MessageReaction} react
     * @memberof Vote
     */
    async onCollect(react: MessageReaction) {
        if ('👍'.includes(react.emoji.name)) this.vote_Y++
        if ('👎'.includes(react.emoji.name)) this.vote_N++
    }

    /**
     * Triggers when a user retracts their vote
     *
     * @param {MessageReaction} react
     * @memberof Vote
     */
    async onRemove(react: MessageReaction) {
        if ('👍'.includes(react.emoji.name)) this.vote_Y--
        if ('👎'.includes(react.emoji.name)) this.vote_N--
    }

    /**
     * Triggers when the vote ends
     *
     * @memberof Vote
     */
    async onEnd() {
        if (this.bot.debug)
            this.bot.logger.debug(`[Vote - ${this.id}] Vote ended with ${this.vote_Y}:${this.vote_N} (total ${this.vote_Y + this.vote_N})`)
    
        if (this.vote_Y > this.vote_N)
            this.onWin()
        else
            this.onLose()
    }

    /**
     * Triggers when the vote ended as win (Yes > No)
     * 
     * @memberof Vote
     */
    async onWin() {
        // your code here
    }

    /**
     * Triggers when the vote ended as lose (No > Yes)
     *
     * @memberof Vote
     */
    async onLose() {
        this.msg.edit({ embeds: [
            this.embed
                .setTitle(`Vote ended, nobody was abused`)
                .setDescription(`amount ${this.vote_Y} 👍 : ${this.vote_N} 👎`)
        ] })
    }
}

export { Vote }
