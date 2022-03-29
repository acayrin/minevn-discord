import { SucklessMod } from "../core/interface/SucklessMod";
import { getHelp } from "./core/Help";
import { Intents } from "discord.js";

export default class CoreHelp extends SucklessMod {
	constructor() {
		super({
			name: "Help page",
			author: "acayrin",
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
			command: "help",
			aliases: ["h"],
			description: "Bot's help page",
			usage: "%prefix%<command/alias> [args]",
			events: {
				onMsgCreate: getHelp,
			},
		});
	}
}
