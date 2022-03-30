import { Intents, Message, MessageAttachment, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { SucklessMod } from "../core/interface/SucklessMod";
import { SucklessBot } from "../core/SucklessBot";

export default class BotStatusMessage extends SucklessMod {
	constructor() {
		super({
			name: "BotStatusMessage",
			author: "acayrin",
			intents: [Intents.FLAGS.GUILDS],
			description: "Automate bot status message",
			usage: "%prefix%<command/alias>",
		});

		this.onInit = this.check;
	}

	private check = async (bot: SucklessBot): Promise<void> => {
		setInterval(() => {
			fetch(`https://mcsrv.vercel.app/?ip=minevn.net`).then((res) =>
				res
					.text()
					.then(async (txt) => {
						const json = JSON.parse(txt);

						bot.cli().user.setActivity({
							type: "PLAYING",
							name: `minevn.net with ${json.onlinePlayers} monkeys`,
						});
					})
					.catch(() => {})
			);
		}, 10000);
	};
}
