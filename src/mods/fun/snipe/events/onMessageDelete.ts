/* eslint-disable @typescript-eslint/no-explicit-any */
import Eris from 'eris';
import fetch from 'node-fetch';

import Yujin from '../../../../core/yujin';

export async function onMessageDelete(message: Eris.Message, opt: { mod: Yujin.Mod }) {
	// ignore webhooks
	if (message.webhookID) return;

	// create cache store
	if (!opt.mod.bot.database.has('snipe_cache')) {
		opt.mod.bot.database.set('snipe_cache', opt.mod, {});
	}
	const cache: any = opt.mod.bot.database.get('snipe_cache', opt.mod);

	// check
	cache[`${message.channel.id}_D`] ||= [];

	// shift oldest record
	if (cache[`${message.channel.id}_D`].length > (opt.mod.getConfig().limit || 20))
		cache[`${message.channel.id}_D`].shift();

	// get attachments
	const files: Eris.FileContent[] = [];
	if (message.attachments?.length > 0)
		await Promise.all(
			message.attachments.map(async (file) => {
				files.push({
					file: await (await fetch(file.url)).buffer(),
					name: file.filename,
				});
			}),
		);

	// get embeds
	const embeds: Eris.Embed[] = [];
	if (message.embeds?.length > 0) {
		message.embeds.forEach((embed) => {
			embeds.push(embed);
		});
	}

	// add record
	cache[`${message.channel.id}_D`].push({
		id: message.id,
		content: message.content,
		files: files,
		owner: message.member?.tag() || 'unknown',
		avatar: message.member?.avatarURL || message.author?.avatarURL || undefined,
		timestamp: message.timestamp,
		embeds: embeds,
	});

	return opt.mod.bot.database.update('snipe_cache', opt.mod, cache);
}
