import { Intents } from "discord.js";
import { SucklessMod } from "../core/interface/SucklessMod";
import { SnipeCreate, SnipeDelete, SnipeUpdate } from "./snipe/";

export default class Snipe extends SucklessMod {
	constructor() {
		super({
			name: "Snipe",
			author: "acayrin",
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
			command: ["snipe", "editsnipe", "clear"],
			aliases: ["s", "es"],
			description: "Snipe somebody and make their day miserable",
			usage: "%prefix%<command/alias> [step]",
			events: {
				onMsgCreate: SnipeCreate,
				onMsgDelete: SnipeDelete,
				onMsgUpdate: SnipeUpdate,
			},
		});
	}
}
