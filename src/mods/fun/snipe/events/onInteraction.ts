import Eris from 'eris';

import Yujin from '../../../../core/yujin';
import { SnipeChatRecord } from '../type/SnipeChatRecord';

export const onInteraction = async (
	i: Eris.CommandInteraction,
	opt: { command: string; args: Eris.InteractionDataOptions[]; mod: Yujin.Mod },
) => {
	// if message is not a command
	if (!opt.command) return;

	// create cache store
	if (!opt.mod.bot.database.has('snipe_cache')) {
		opt.mod.bot.database.set('snipe_cache', opt.mod, {});
	}
	const cache: any = opt.mod.bot.database.get('snipe_cache', opt.mod);

	// check
	cache[`${i.channel.id}_D`] ||= [];
	cache[`${i.channel.id}_U`] ||= [];

	// get index
	const num = 0 - Math.abs(Number((opt.args as Eris.InteractionDataOptionWithValue[]).shift()?.value) || 0);

	switch (opt.command) {
		// normal snipe
		case 's':
		case 'snipe': {
			const rep: SnipeChatRecord = cache[`${i.channel.id}_D`].at(num || -1);
			if (!rep) return;
			i.channel.createMessage(
				{
					embeds: [
						...rep.embeds,
						new Eris.Embed()
							.setColor(opt.mod.bot.color)
							.setAuthor(rep.owner, undefined, rep.avatar)
							.setDescription(rep.content)
							.setTimestamp(rep.timestamp),
					],
				},
				rep.files || null,
			);
			break;
		}
		// edit snipe
		case 'es':
		case 'editsnipe': {
			const rep: SnipeChatRecord = cache[`${i.channel.id}_U`].at(num || -1);
			if (!rep) return;
			i.channel.createMessage(
				{
					embeds: [
						...rep.embeds,
						new Eris.Embed()
							.setColor(opt.mod.bot.color)
							.setAuthor(rep.owner, undefined, rep.avatar)
							.setDescription(rep.content)
							.setTimestamp(rep.timestamp),
					],
				},
				rep.files || null,
			);
			break;
		}
		// clear everything
		case 'clear': {
			if (i.member?.permissions.has('manageMessages')) {
				cache[`${i.channel.id}_D`].length = 0;
				cache[`${i.channel.id}_U`].length = 0;
				opt.mod.bot.database.update('snipe_cache', cache, opt.mod);
				i.createFollowup('*Swoosh*');
			}
			break;
		}
		default: {
			// how tf did you get here
		}
	}
};
