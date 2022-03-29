import { Message, MessageAttachment, MessageEmbed, Webhook } from "discord.js";
import { SucklessBot } from "../../core/SucklessBot";
import { database } from "./Database";
import { filter } from "./Filter";
import { whook } from "./Webhook";

export class chatfilter {
	private __filter: filter = undefined;

	constructor(url?: string) {
		// load filter list
		if (url) database.loadDB(url).then((db) => (this.__filter = new filter(db)));
	}

	/**
	 * Load filter
	 *
	 * @param {string} url filter list url
	 * @memberof chatfilter
	 */
	public load(url: string): void {
		database.loadDB(url).then((db) => (this.__filter = new filter(db)));
	}

	/**
	 * Check if the message is cursed or not then process it
	 * @param message input message
	 * @param bot suckless bot instance
	 */
	public async makeThisChatClean(message: Message, bot: SucklessBot): Promise<any> {
		// ignore + bot + non-text based channels + url messages
		if (
			message.author.bot ||
			!message.channel.isText() ||
			/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g.test(
				message.content
			)
		)
			return;

		// filter message
		const __d_start = Date.now();
		const out = await this.__filter.adv_replace(message.content);
		// if message is different
		if (out[0] !== message.content) {
			// reply embed, if any
			let rep_embed: MessageEmbed = undefined;
			try {
				const rep: Message = await message.channel.messages.fetch(message.reference.messageId);
				rep_embed = new MessageEmbed()
					.setColor(bot.configs.get("core.json")["color"])
					.setAuthor(
						(rep.member?.nickname || rep.author.username) + " (click to move)",
						rep.member?.avatarURL() || rep.author.avatarURL(),
						rep.url
					)
					.setDescription(rep.content)
					.setFooter(
						`Lưu ý: Sử dụng từ ngữ không hợp lệ quá nhiều sẽ khiến bạn bị mút! [${out[1]} - ${
							Date.now() - __d_start
						}ms]`
					);
			} catch (e) {
				// ignored cuz of unable to fetch reply
			}

			// payload: embeds
			const payload_embeds = message.embeds;
			// reply embeds
			if (rep_embed) {
				payload_embeds.push(rep_embed);
			} else {
				// warning embed
				payload_embeds.push(
					new MessageEmbed()
						.setColor(bot.configs.get("core.json")["color"])
						.setFooter(
							`Lưu ý: Sử dụng từ ngữ không hợp lệ quá nhiều sẽ khiến bạn bị mút! [${out[1]} - ${
								Date.now() - __d_start
							}ms]`
						)
				);
			}

			// payload: attachments
			const payload_attachments: MessageAttachment[] = Array.from(message.attachments.values());
			// check if message is too long, send text file instead
			const ovf =
				out[0].length > 2000 ? new MessageAttachment(Buffer.from(out[0], "utf-8"), "out.txt") : undefined;
			// add text file to payload, if any
			if (ovf) payload_attachments.push(ovf);

			// payload: content
			const payload_content = ovf ? "*Tin nhắn đã được chuyển sang dạng file vì quá dài.*" : out[0];

			// get webhook
			const webhook: Webhook = await new whook(bot, message.channel).getHook();

			// send payload
			return message.delete().finally(() =>
				webhook.send({
					content: payload_content,
					username: message.member?.nickname || message.author.username,
					avatarURL: message.member?.avatarURL() || message.author.avatarURL(),
					embeds: payload_embeds,
					files: payload_attachments,
				})
			);
		}
	}
}
