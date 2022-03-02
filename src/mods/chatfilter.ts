import { Intents, Message } from "discord.js";
import { chatfilter } from "./chatfilter/";
const cf: chatfilter = new chatfilter();

export = {
	name: "ChatFilter",
	author: "acayrin",
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
	description: "Filter bad words",
    usage: "%prefix%<command/alias> [args]",
    onMsgCreate: cf.makeThisChatClean
};
