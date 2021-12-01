import * as crypto from "crypto"
import { Collection, GuildMember, Message, MessageEmbed, MessageReaction, Role, TextChannel, User } from "discord.js"
import { Bot } from "../../bot"

/**
 * Vote mute someone cuz i love democracy
 *
 * @param {Message} message
 * @param {string[]} args
 * @param {Bot} bot
 */
async function VoteMute (message: Message, args: string[], bot: Bot) {
    if (!args) return
    const com = args.join()

    // user check
    let user = message.mentions.members.first()
    if (!user && com.length > 0)
        if (parseInt(com))
            user = (await message.guild.members.fetch({ user: [ com ] })).first()
        else
            user = (await message.guild.members.fetch({ query: com, limit: 1 })).first()
    if (!user) 
        return message.channel.send(`Looking for a ghost? Try that again but be sure to mention someone`)

    // create vote
    const vote = new Vote(user, message.channel, bot)
          vote.start()
}

/**
 * A Vote instance, to mute anyone
 *
 * @class Vote
 */
class Vote {
    // variables, for internal uses
    private target  : GuildMember
    private channel : TextChannel | any
    private bot     : Bot

    private vote_Y  : number = 0
    private vote_N  : number = 0
    private id      = crypto.createHash('md5').update(Date.now().toString(), 'utf-8').digest('hex').slice(0, 7)
    private msg     : Message

    private embed = new MessageEmbed()
        .setTimestamp()
        .setColor('#ed2261')
        .setTitle('Vote mute')
        .setDescription('Vote mute')
        .setFooter('i love democracy')

    /**
     * Creates an instance of Vote.
     * @param {GuildMember} target User to mute
     * @param {(TextChannel | any)} channel Base text channel
     * @param {Bot} bot Bot instance
     * @memberof Vote
     */
    constructor(target: GuildMember, channel: TextChannel | any, bot: Bot) {
        this.bot     = bot
        this.target  = target
        this.channel = channel
    }

    /**
     * Start the vote
     *
     * @memberof Vote
     */
    public async start() {
        if (await this.getUserMutedState(this.target))
            return this.channel.send(`User **${this.target.user.tag}** is already muted, give them some break`)

        if (this.bot.debug)
            this.bot.logger.debug(`[VoteMute - ${this.id}] A vote has started, target: ${this.target.id}`)

        this.msg = await this.channel.send({ embeds: [
            this.embed
                .setTitle(`Mute: ${this.target.user.tag}`)
                .setDescription(`Voting ends in ${this.bot.config.mute.timer}s`)
        ] })
        await this.msg.react('👍')
        await this.msg.react('👎')

        this.msg.createReactionCollector({ 
            filter : (r: MessageReaction, u: User) => (['👍', '👎'].includes(r.emoji.name) && !u.bot), 
            time   : this.bot.config.mute.timer * 1000, 
            dispose: true 
        })
        .on('collect', this.onCollect.bind(this))
        .on('remove', this.onRemove.bind(this))
        .on('end', this.onEnd.bind(this))
    }

    /**
     * Triggers when a user casts their vote
     *
     * @private
     * @param {MessageReaction} react
     * @memberof Vote
     */
    private onCollect(react: MessageReaction) {
        if ('👍'.includes(react.emoji.name)) this.vote_Y++
        if ('👎'.includes(react.emoji.name)) this.vote_N++
    }

    /**
     * Triggers when a user retracts their vote
     *
     * @private
     * @param {MessageReaction} react
     * @memberof Vote
     */
    private onRemove(react: MessageReaction) {
        if ('👍'.includes(react.emoji.name)) this.vote_Y--
        if ('👎'.includes(react.emoji.name)) this.vote_N--
    }

    /**
     * Triggers when the vote ends
     *
     * @private
     * @memberof Vote
     */
    private onEnd() {
        if (this.bot.debug)
            this.bot.logger.debug(`[VoteMute - ${this.id}] Vote ended with ${this.vote_Y}:${this.vote_N} (total ${this.vote_Y + this.vote_N})`)
    
        if (this.vote_Y > this.vote_N)
            this.onWin()
        else
            this.onLose()
    }

    /**
     * Triggers when the vote ended as win (Yes > No)
     *
     * @private
     * @memberof Vote
     */
    private async onWin() {
        const role = await this.getMutedRole()
        if (!role.first())
            return this.channel.send(`Can't find any **muted** role, stop abusing now.`)

        this.msg.edit({ embeds: [
            this.embed
                .setTitle(`Muted: ${this.target.user.tag} [${this.bot.config.mute.duration}m]`)
                .setDescription(`reason: mob vote\namount ${this.vote_Y} 👍 : ${this.vote_N} 👎`)
        ] })
        this.target.roles.add(role)

        setTimeout(_ => {
            this.target.roles.remove(role)
            this.channel.send(`Unmuted **${this.target.user.tag}**`)

            // debug
            if (this.bot.debug)
                this.bot.logger.debug(`[VoteMute - ${this.id}] Unmuted user ${this.target.id}`)
        }, this.bot.config.mute.duration * 60000)
    }

    /**
     * Triggers when the vote ended as lose (No > Yes)
     *
     * @private
     * @memberof Vote
     */
    private onLose() {
        this.msg.edit({ embeds: [
            this.embed
                .setTitle(`Vote ended, nobody was abused`)
                .setDescription(`amount ${this.vote_Y} 👍 : ${this.vote_N} 👎`)
        ] })
    }

    /**
     * Get the guild's muted role (if any)
     *
     * @private
     * @return {Promise<Collection<string, Role>>} muted role
     * @memberof Vote
     */
    private async getMutedRole(): Promise<Collection<string, Role>> {
        const gr = await this.channel.guild.roles.fetch()
        const mr = gr.filter((r: Role) => r.name.toLowerCase().includes(this.bot.config.mute.role || 'mute'))
        return mr
    }
    
    /**
     * Get the user's muted state
     *
     * @private
     * @param {GuildMember} user the user to check
     * @return {*}  {Promise<boolean>} true, if muted, else false
     * @memberof Vote
     */
    private async getUserMutedState(user: GuildMember): Promise<boolean> {
        const role = await this.getMutedRole()
        if (!role.first())
            return false
        else if(user.roles.cache.has(role.first().id))
            return true
        else
            return false
    }
}

export { VoteMute }
