import Eris from 'eris';
import fetch from 'node-fetch';

import Yujin from '../../../../core/yujin';

export const onMessageUpdate = async (newMsg: Eris.Message, oldMsg: Eris.OldMessage, opt: { mod: Yujin.Mod }) => {
	// ignore webhooks
	if (newMsg.webhookID) return;

	// create cache store
	if (!opt.mod.bot.database.has('snipe_cache')) {
		opt.mod.bot.database.set('snipe_cache', opt.mod, {});
	}
	const cache: any = opt.mod.bot.database.get('snipe_cache', opt.mod);

	// check
	cache[`${newMsg.channel.id}_U`] ||= [];

	// ignore bots
	if (newMsg.author.bot || oldMsg === null) return;

	// shift oldest record
	if (cache[`${newMsg.channel.id}_U`].length > (opt.mod.getConfig().limit || 20))
		cache[`${newMsg.channel.id}_U`].shift();

	// get attachments
	const files: Eris.FileContent[] = [];
	if (oldMsg.attachments?.length > 0)
		await Promise.all(
			oldMsg.attachments.map(async (file) => {
				files.push({
					file: await (await fetch(file.url)).buffer(),
					name: file.filename,
				});
			}),
		);

	// get embeds
	const embeds: Eris.Embed[] = [];
	if (oldMsg.embeds?.length > 0) {
		oldMsg.embeds.forEach((embed) => {
			embeds.push(embed);
		});
	}

	// add record
	cache[`${newMsg.channel.id}_U`].push({
		id: newMsg.id,
		content: oldMsg.content,
		files: files,
		owner: newMsg.author?.tag() || 'unknown',
		avatar: newMsg.member?.avatarURL || newMsg.author?.avatarURL || 'unknown',
		timestamp: oldMsg.editedTimestamp,
		embeds: embeds,
	});

	return opt.mod.bot.database.update('snipe_cache', opt.mod, cache);
};
