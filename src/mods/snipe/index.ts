import * as Discord from "discord.js";
import fetch from "node-fetch";
import { SucklessBot } from "../../core/SucklessBot";
import { SnipeChatRecord } from "./interface/SnipeChatRecord";

const record_D: any = {};
const record_U: any = {};

/**
 * Triggers when a message is sent
 *
 * @param {Message} message The message
 * @param {string[]} args Arguments from message
 * @param {SucklessBot} bot The bot instance
 */
export const SnipeCreate = (message: Discord.Message, args: string[], bot: SucklessBot) => {
	// check
	record_D[message.channelId] ||= [];
	record_U[message.channelId] ||= [];

	// if message is not a command
	if (!args) return;

	const arg = message.content.replace(bot.configs.get("core.json")['prefix'], "").trim().split(/ +/);
	const cmd = arg.shift().toLocaleLowerCase();
	const num = -1 - Math.abs(Number(arg.shift()));

	switch (cmd) {
		// normal snipe
		case "s":
		case "snipe": {
			const rep = record_D[message.channelId].at(num || -1);
			if (!rep) return;
			message.reply({
				embeds: [_e(rep, bot)],
				files: rep.files || null,
			});
			break;
		}
		// edit snipe
		case "es":
		case "editsnipe": {
			const rep = record_U[message.channelId].at(num || -1);
			if (!rep) return;
			message.reply({
				embeds: [_e(rep, bot)],
				files: rep.files || null,
			});
			break;
		}
		// clear everything
		case "clear": {
			if (message.member.permissions.has("MANAGE_MESSAGES")) {
				record_U[message.channelId].length = 0;
				record_D[message.channelId].length = 0;

				// debug
				if (bot.debug) bot.logger.debug(`[Snipe - ${message.channelId}] Cleared local cache`);
			}
			break;
		}
		default: {
			// how tf did you get here
		}
	}
};

/**
 * Triggers when a message gets deleted
 *
 * @param {Message} message The deleted message
 * @param {*} args empty
 * @param {SucklessBot} bot The bot instance
 */
export const SnipeDelete = (message: Discord.Message, args: any, bot: SucklessBot) => {
	// check
	record_D[message.channelId] ||= [];
	record_U[message.channelId] ||= [];

	// shift oldest record
	if (record_D[message.channelId].length > bot.configs.get("snipe.json")['limit']) record_D[message.channelId].shift();

	// debug
	bot?.emit(
		"debug",
		`[Snipe - ${message.channelId}] Deleted +${message.id} (${record_D[message.channelId].length}/${
			bot.configs.get("snipe.json")['limit']
		})`
	);

	// get attachments
	const files: { attachment: any; name: string }[] = [];
	message.attachments.forEach(async (file) => {
		const buffer = await (await fetch(file.attachment.toString())).buffer();
		files.push({ attachment: buffer, name: file.name });
	});

	// add record
	return record_D[message.channelId].push({
		id: message.id,
		content: message.content,
		files: files,
		owner: message.author.tag,
		avatar: message.author.avatarURL(),
		timestamp: message.createdTimestamp,
	});
};

/**
 * Triggers when a message gets updated
 *
 * @param {Message} oldMsg The old message
 * @param {Message} newMsg The updated message
 * @param {*} args empty
 * @param {SucklessBot} bot The bot instance
 */
export const SnipeUpdate = (oldMsg: Discord.Message, newMsg: Discord.Message, bot: SucklessBot) => {
	// check
	record_D[oldMsg.channelId] ||= [];
	record_U[oldMsg.channelId] ||= [];

	// shift oldest record
	if (record_U[oldMsg.channelId].length > bot.configs.get("snipe.json")['limit']) record_U[oldMsg.channelId].shift();

	// debug
	bot.emit(
		"debug",
		`[Snipe - ${oldMsg.channelId}] Updated +${oldMsg.id} (${record_U[oldMsg.channelId].length}/${
			bot.configs.get("snipe.json")['limit']
		})`
	);

	// get attachments
	const files: { attachment: any; name: string }[] = [];
	oldMsg.attachments.forEach(async (file) => {
		const buffer = await (await fetch(file.attachment.toString())).buffer();
		files.push({ attachment: buffer, name: file.name });
	});

	// add record
	return record_U[oldMsg.channelId].push({
		id: oldMsg.id,
		content: oldMsg.content,
		files: files,
		owner: oldMsg.author.tag,
		avatar: oldMsg.author.avatarURL(),
		timestamp: oldMsg.createdTimestamp,
	});
};

/**
 * Generates a new embed, for snipe responses
 *
 * @param {SnipeChatRecord} a Chat record
 * @param {SucklessBot} b SucklessBot instance, for embed color
 * @return {MessageEmbed} Discord embed
 */
const _e = (a: SnipeChatRecord, b: SucklessBot): Discord.MessageEmbed => {
	return new Discord.MessageEmbed()
		.setColor(b.configs.get("core.json")['color'])
		.setAuthor(a.owner, a.avatar)
		.setDescription(a.content)
		.setTimestamp(a.timestamp);
};
