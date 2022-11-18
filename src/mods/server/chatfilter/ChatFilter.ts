/* eslint-disable no-mixed-spaces-and-tabs */
import Eris from 'eris';
import fetch from 'node-fetch';
import Yujin from '../../../core/yujin';
import { SoftFilter } from './filters/SoftFilter';

const cached_webhooks: Map<string, Eris.Webhook> = new Map();

/**
 * Check if the message is cursed or not then process it
 * @param message input message
 * @param bot yujin bot instance
 */
export const ChatFilter = async (message: Eris.Message, mod: Yujin.Mod): Promise<unknown> => {
	// ignore + bot + non-text based channels + url messages
	if (
		message.author.bot ||
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g.test(
			message.content,
		)
	)
		return;

	// ignore NSFWs
	if (message.channel.toJSON()['nsfw'] as boolean) return;

	// filter message
	const out = await new SoftFilter(mod).filter(message.content);
	// if message is different
	if (out !== message.content) {
		const payload: {
			content: string;
			embeds: (Eris.Embed | Eris.EmbedOptions)[];
			attachments: Eris.FileContent[];
			reply: Eris.Embed | Eris.EmbedOptions;
		} = {
			content: out,
			embeds: [],
			attachments: [],
			reply: undefined,
		};

		// reply embed, if any
		try {
			const rep: Eris.Message = await message.channel.getMessage(message.messageReference.messageID);
			payload.embeds.push(
				new Eris.Embed()
					.setColor(mod.bot.color)
					.setAuthor(
						`${rep.member?.nick || rep.author.username} (click to move)`,
						rep.jumpLink,
						rep.member?.avatarURL || rep.author.avatarURL,
					)
					.setDescription(rep.content),
			);
		} catch (e) {
			// empty
		}

		// payload: embeds
		payload.embeds.concat(message.embeds);

		// payload: attachments
		await Promise.all(
			message.attachments?.map(async (a) => {
				payload.attachments.push({
					name: a.filename,
					file: await (await fetch(a.url)).buffer(),
				});
			}),
		);

		// check if message is too long, send text file instead
		const ovf: Eris.FileContent =
			out[0].length > 2000
				? {
						name: 'out.txt',
						file: Buffer.from(out[0], 'utf-8'),
				  }
				: undefined;
		// payload: content
		// add text file to payload, if any
		if (ovf) {
			payload.content = '*Message had been converted to a text file due to length limitation.*';
			payload.attachments.unshift(ovf);
		}

		return message
			.delete() // delete
			.catch((e) => {
				// most likely deleted
				mod.bot.error({
					name: mod.name,
					message: e.message,
					cause: e.cause,
					stack: e.stack
				});
			})
			.finally(async () => {
				if (mod.getConfig().method?.toLowerCase() === 'webhook') {
					if (!cached_webhooks.has(message.channel.id)) {
						cached_webhooks.set(
							message.channel.id,
							(await mod.bot.client.getChannelWebhooks(message.channel.id)).find(
								(wh) => wh.user.id === mod.bot.client.user.id,
							) ||
								(await mod.bot.client.createChannelWebhook(
									message.channel.id,
									{
										name: 'Yujin',
										avatar: message.channel.client.user.avatarURL,
									},
									'Automated webhook generation for chat filter',
								)),
						);
					}

					try {
						await mod.bot.client.executeWebhook(
							cached_webhooks.get(message.channel.id).id,
							cached_webhooks.get(message.channel.id).token,
							{
								avatarURL: message.member?.avatarURL || message.author.avatarURL,
								username: message.member?.nick || message.author.username,
								content: payload.content,
								embeds: payload.embeds,
								file: payload.attachments,
							},
						);
					} catch (e) {
						cached_webhooks.delete(message.channel.id);

						payload.embeds.unshift(
							new Eris.Embed()
								.setColor(mod.bot.color)
								.setAuthor(
									message.member?.nick || message.author.username,
									undefined,
									message.member?.avatarURL || message.author.avatarURL,
								),
						);

						try {
							await message.channel.createMessage(
								{
									content: payload.content,
									embeds: payload.embeds,
								},
								payload.attachments,
							);
						} catch (e) {
							await message.report(e, __filename);
						}
					}
				} else {
					payload.embeds.unshift(
						new Eris.Embed()
							.setColor(mod.bot.color)
							.setAuthor(
								message.member?.nick || message.author.username,
								undefined,
								message.member?.avatarURL || message.author.avatarURL,
							),
					);

					try {
						await message.channel.createMessage(
							{
								content: payload.content,
								embeds: payload.embeds,
							},
							payload.attachments,
						);
					} catch (e) {
						await message.report(e, __filename);
					}
				}
			});
	}
};
