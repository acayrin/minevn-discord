import { SucklessMod } from "../core/interface/SucklessMod";
import { Intents } from "discord.js";
import { SendImg } from "./weaboo/";

export default class Weaboo extends SucklessMod {
	constructor() {
		// declare your mod
		super({
			name: "WeabooForLife",
			description: "Get some random anime pics\ntho some tags may have limited amount of pics (dont' blame me)",
			usage: "%prefix%<command/alias> [tag]",
			command: ["wibu"],
			aliases: ["wb"],
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
			events: {
				onMsgCreate: SendImg,
			},
		});
	}
}
