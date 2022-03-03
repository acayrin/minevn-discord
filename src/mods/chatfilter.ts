import { Intents, Message } from "discord.js";
import { SucklessBot } from "../core/sucklessbot";
import { chatfilter } from "./chatfilter/";
const cf: chatfilter = new chatfilter();

export = {
	name: "ChatFilter",
	author: "acayrin",
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
	description: "Filter bad words",
	usage: "%prefix%<command/alias> [args]",
	onInit: (bot: SucklessBot) => cf.load(bot.configs.get("chatfilter.json")['url']),
	onMsgCreate: (message: Message, args: string[], bot: SucklessBot) => cf.makeThisChatClean(message, bot),
	onMsgUpdate: (oldMsg: Message, newMsg: Message, bot:SucklessBot) => cf.makeThisChatClean(newMsg, bot)
};
