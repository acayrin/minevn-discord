import { SucklessMod } from "../core/interface/SucklessMod";
import { CreatePlayer } from "./musicplayer/";
import { Intents } from "discord.js";

export default class MusicPlayer extends SucklessMod {
	constructor() {
		super({
			name: "MusicPlayer",
			description: "A simple music player since Susan decided to killed off most of available bots",
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
			command: ["player", "youtube"],
			aliases: "yt",
			usage: "Use ``%prefix%yt`` for full usage guide",
			author: "acayrin",
			events: {
				onMsgCreate: CreatePlayer
			}
		});
	};
};
