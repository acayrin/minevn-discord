import { Intents, Message, MessageAttachment, MessageEmbed } from "discord.js"
import { Bot } from "../core/bot"
import { DSChatRecord } from "./snipe/DSChatRecord"

const record_D: DSChatRecord[] = []
const record_U: DSChatRecord[] = []
/**
 * Triggers when a message is sent
 *
 * @param {Message} message The message
 * @param {string[]} args Arguments from message
 * @param {Bot} bot The bot instance
 */
const Snipe = (message: Message, args: string[], bot: Bot) => {
    // if message is not a command
    if (!args)
        return

    const arg = message.content.split(/ +/)
          arg.shift()
    const cmd = arg.shift().toLocaleLowerCase()
	const num = -1 - Math.abs(Number(arg.shift()))

	switch (cmd) {
		// normal snipe
		case 's':
        case 'snipe': {
			if (record_D.length < 1)
				return

			const rep = record_D.at(num || -1)
			message.reply({
				embeds: [ _e(rep) ],
				files : rep.files || null
			})
			break
		}
		// edit snipe
        case 'es':
		case 'editsnipe': {
			if (record_U.length < 1)
				return

			const rep = record_U.at(num || -1)
			message.reply({
				embeds: [ _e(rep) ],
				files : rep.files || null
			})
			break
		}
		// clear everything
		case 'clear': {
			if (message.member.permissions.has('MANAGE_MESSAGES')) {
				record_U.length = 0
				record_D.length = 0

				// debug
				if (bot.debug)
					bot.logger.debug(`[Snipe] Cleared local cache`)
			}
			break
		}
		default: {
			// how tf did you get here
		}
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
	// shift oldest record
	if (record_D.length > bot.config.snipe.limit)
		record_D.shift()

	// debug
	if (bot.debug)
		bot.logger.debug(`[Snipe] Deleted +${message.id} (${record_D.length}/${bot.config.snipe.limit})`)

	// get attachments
	const files: MessageAttachment[] = []
	message.attachments.forEach(file => {
		files.push(new MessageAttachment(file.attachment, file.name))
	})

	// add record
   	return record_D.push({
		id		: message.id,
	   	content	: message.content,
	   	files	: files,
		owner	: message.author.tag,
		avatar	: message.author.avatarURL()
	})
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
	// shift oldest record
	if (record_U.length > bot.config.snipe.limit)
		record_U.shift()

	// debug
	if (bot.debug)
		bot.logger.debug(`[Snipe] Updated +${oldMsg.id} (${record_U.length}/${bot.config.snipe.limit})`)

	// get attachments
	const files: { attachment: any, name: string }[] = []
	oldMsg.attachments.forEach(file => {
		files.push({ attachment: file.attachment, name: file.name })
	})

	// add record
	return record_U.push({
		id		: oldMsg.id,
		content : oldMsg.content,
		files	: files,
		owner	: oldMsg.author.tag,
		avatar	: oldMsg.author.avatarURL()
	})
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
    command: [ "snipe", "editsnipe", "clear" ],
    aliases: [ "s", "es" ],
    description: "Snipe somebody and make their day miserable",
    usage: "%prefix% <command/alias> [step]",
    onMsgCreate : Snipe,
    onMsgDelete : SnipeDelete,
    onMsgUpdate : SnipeUpdate,
}