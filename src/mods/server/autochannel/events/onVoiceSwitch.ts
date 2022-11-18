import Eris from 'eris';

import Yujin from '../../../../core/yujin';
import { onVoiceJoin } from './onVoiceJoin';

export async function onVoiceSwitch(o: {
	mem: Eris.Member;
	newChannel: Eris.VoiceChannel;
	oldChannel: Eris.VoiceChannel;
	mod: Yujin.Mod;
}) {
	if (o.mod.getDatastore().get(o.oldChannel.id)) {
		const list: number[] = o.mod.getConfig().channels;

		// if user spam join auto-create channel
		if (list.includes(Number(o.newChannel.id))) {
			onVoiceJoin({ mem: o.mem, channel: o.newChannel, mod: o.mod });
		}

		// if old chanenl is empty
		const members = o.oldChannel.voiceMembers.filter((member) => !member.bot);
		if (members.length === 0) {
			o.oldChannel
				.delete()
				.then(() => o.mod.getDatastore().remove(o.oldChannel.id))
				.catch((e: Error) => {
					o.mod.bot.error({
						name: o.mod.name,
						message: `Error while deleting channel ${o.oldChannel.id} - ${e.message}`,
						cause: e.cause,
						stack: e.stack,
					});
				});
		}

		// only switch owner if previous one is gone
		if (!members.includes(o.mod.getDatastore().get(o.oldChannel.id))) {
			let mem: Eris.Member = o.oldChannel.voiceMembers.random();
			while (mem.bot) mem = o.oldChannel.voiceMembers.random();

			o.mod.getDatastore().set({
				key: o.oldChannel.id,
				value: mem.id,
			});
			return o.oldChannel.edit({
				name: (o.mod.getConfig().name || "%username%'s channel").replace(
					'%username%',
					mem.nick || mem.username,
				),
			});
		}
	}
}
