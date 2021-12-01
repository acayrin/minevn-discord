import { Message } from "discord.js"
import { Bot } from "../../core/bot"
import { VoteMute } from "./votemute"
import { VoteUnmute } from "./voteunmute"

/**
 * Vote mute someone cuz i love democracy
 *
 * @param {Message} message
 * @param {string[]} args
 * @param {Bot} bot
 */
async function VM (message: Message, args: string[], bot: Bot) {
    if (!args) return
    const com = args.join(' ')

    // user check
    let user = message.mentions.members.first()
    if (!user && com.length > 0)
        if (!isNaN(Number(com)))
            user = (await message.guild.members.fetch({ user: com }))
        else
            user = (await message.guild.members.fetch({ query: com, limit: 1 })).first()
    if (!user) 
        return message.channel.send(`Looking for a ghost? Try that again but be sure to mention someone`)
    if (user.user.bot)
        return message.channel.send(`**${user.user.tag}** is a robot u sussy baka`)

    // create vote
    const vote = new VoteMute(user, message.channel, bot, null)
          vote.vote()
}

/**
 * Vote un-mute someone cuz i love democracy
 *
 * @param {Message} message
 * @param {string[]} args
 * @param {Bot} bot
 */
 async function VUM (message: Message, args: string[], bot: Bot) {
    if (!args) return
    const com = args.join(' ')

    // user check
    let user = message.mentions.members.first()
    if (!user && com.length > 0)
        if (!isNaN(Number(com)))
            user = (await message.guild.members.fetch({ user: com }))
        else
            user = (await message.guild.members.fetch({ query: com, limit: 1 })).first()
    if (!user) 
        return message.channel.send(`Looking for a ghost? Try that again but be sure to mention someone`)
    if (user.user.bot)
        return message.channel.send(`**${user.user.tag}** is a robot u sussy baka`)
        
    // create vote
    const vote = new VoteUnmute(user, message.channel, bot, null)
          vote.vote()
}

export { VM, VUM }
