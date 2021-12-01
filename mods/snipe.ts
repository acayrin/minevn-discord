import { Intents, Message, MessageEmbed } from "discord.js"
import { Bot } from "../bot"
import { DSChatRecord } from "../interface/DSChatRecord"

const _m1: DSChatRecord[] = []   // store newly created messages here
let   _m2: DSChatRecord   = null // store deleted message here
let   _m3: DSChatRecord   = null // store edited message here

/**
 * Triggers when a message is sent
 *
 * @param {Message} message The message
 * @param {string[]} args Arguments from message
 * @param {Bot} bot The bot instance
 */
const Snipe = (message: Message, args: string[], bot: Bot) => {
    // remove last one
	if (_m1.length >= bot.config.snipe.limit) 
        _m1.pop()
	    _m1.push({
		    id     : message.id,
		    content: message.cleanContent,
		    files  : message.attachments || null,
		    owner  : message.author.tag,
		    avatar : message.author.avatarURL()
	    })

    // if message is not a command
    if (!args)
        return

    const arg = message.content.split(/ +/)
          arg.shift()
    const cmd = arg.shift().toLocaleLowerCase()

	switch (cmd) {
		// normal snipe
		case 's'    :
        case 'snipe': {
			if (!_m2) return
			message.reply({
				embeds: [ _e(_m2) ],
				files : _m2.files || null
			})
			break
		}
		// edit snipe
        case 'es'       :
		case 'editsnipe': {
			if (!_m3) return
			message.reply({
				embeds: [ _e(_m3) ],
				files : _m3.files || null
			})
			break
		}
		default:
			message.reply({
				embeds: [
					new MessageEmbed()
					.setColor('#ed2261')
					.setTitle(`Sniper`)
					.setThumbnail(bot.cli().user.avatarURL())
					.setDescription(`sus`)
					.addField('snipe', 'snipe a deleted message')
					.addField('editsnipe', 'snipe an edited message')
					.setTimestamp()
				]
			})
	}
}

/**
 * Triggers when a message gets deleted
 *
 * @param {Message} message The deleted message
 * @param {*} args empty
 * @param {Bot} bot The bot instance
 */
const SnipeDelete = (message: Message, args: any, bot: Bot) => {
    const find: DSChatRecord = _m1.find((m: DSChatRecord) => m.id.includes(message.id))
    if (bot.debug && find)
        bot.logger.debug(`[Snipe] Delete - ${message.id} => found ${find.id || null}`)
	return _m2 = find
}

/**
 * Triggers when a message gets updated
 *
 * @param {Message} oldMsg The old message
 * @param {Message} newMsg The updated message
 * @param {*} args empty
 * @param {Bot} bot The bot instance
 */
const SnipeUpdate = (oldMsg: Message, newMsg: Message, bot: Bot) => {
    const find: DSChatRecord = _m1.find((m: DSChatRecord) => m.id.includes(newMsg.id))
    if (bot.debug && find)
        bot.logger.debug(`[Snipe] Update - ${newMsg.id} => found ${find.id || null}`)
	return _m3 = find
}

/**
 * Generates a new embed, for snipe responses
 *
 * @param {DSChatRecord} a Chat record
 * @return {MessageEmbed} Discord embed 
 */
const _e = (a: DSChatRecord): MessageEmbed => {
	return new MessageEmbed()
		.setColor('#ed2261')
		.setAuthor(a.owner, a.avatar)
		.setDescription(a.content)
		.setTimestamp()
}

export = {
    name: "Snipe",
    author: "acayrin",
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
    command: [ "snipe", "editsnipe" ],
    aliases: [ "s", "es" ],
    description: "Vote mute somebody cuz democracy is kul",
    usage: "%prefix% mute <Username>[/<Tag>/<User ID>]]",
    onMsgCreate : Snipe,
    onMsgDelete : SnipeDelete,
    onMsgUpdate : SnipeUpdate,
}