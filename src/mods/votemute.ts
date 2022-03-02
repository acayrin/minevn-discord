import { Intents } from "discord.js";
import { VM } from "./vote";

export = {
	name: "VoteMute",
	author: "acayrin",
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
	command: "votemute",
	aliases: ["vm"],
	description: "Vote mute somebody cuz democracy is kul",
	usage: "%prefix%<command/alias> <mention>[/<user ID>/<username>] [reason]",
	onMsgCreate: VM,
};
