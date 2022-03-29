import { SucklessMod } from "../core/interface/SucklessMod";
import { SucklessBot } from "../core/SucklessBot";
import { Intents, Message } from "discord.js";

export default class AntiScam extends SucklessMod {
	constructor() {
		super({
			name: "AntiScam",
			author: "acayrin",
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
			description: "Remove all* messages that are possibly scam",
			usage: "none",
			priority: 9999,
			events: {
				onMsgCreate: async (msg: Message): Promise<any> => {
					if (msg.embeds?.length > 0) {
						const title = msg.embeds?.at(0).title;
						//const url = msg.embeds?.at(0).url;
						//const desc = msg.embeds?.at(0).description;
						if (title?.match(/free/gi) && title?.match(/nitro/gi) && title?.match(/steam/gi)) {
							await msg.delete().finally(() => {
								msg.channel.send(
									`${msg.author} **YOU'RE FORBIDDEN FROM POSTING FAKE DISCORD NITRO WEBSITES!**`
								);
							});
						}
					}
				},
			},
		});
	}
}
