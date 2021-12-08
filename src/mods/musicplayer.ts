import { Intents } from "discord.js";
import { CreatePlayer } from "./musicplayer/";

export = {
	name: "Music player",
	description: "A simple music player since Susan decided to killed off most of available bots",
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
	command: ["player", "youtube"],
	aliases: "yt",
	usage: "Use ``%prefix%yt`` for full usage guide",
	author: "acayrin",
	onMsgCreate: CreatePlayer,
};
