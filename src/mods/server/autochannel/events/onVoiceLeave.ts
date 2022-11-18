import Eris from 'eris';

import Yujin from '../../../../core/yujin';

export async function onVoiceLeave(o: { channel: Eris.VoiceChannel; mod: Yujin.Mod }) {
	if (o.mod.getDatastore().get(o.channel.id)) {
		const members = o.channel.voiceMembers.filter((member) => !member.bot);

		if (members.length === 0) {
			return o.channel
				.delete()
				.then(() => o.mod.getDatastore().remove(o.channel.id))
				.catch((e: Error) => {
					o.mod.bot.error({
						name: o.mod.name,
						message: `Error while deleting channel ${o.channel.id} - ${e.message}`,
						cause: e.cause,
						stack: e.stack,
					});
				});
		}

		// only switch owner if previous one is gone
		if (!members.find((member) => member.id === o.mod.getDatastore().get(o.channel.id))) {
			let member: Eris.Member = o.channel.voiceMembers.random();
			while (member.bot) member = o.channel.voiceMembers.random();

			o.mod.getDatastore().set({
				key: o.channel.id,
				value: member.id,
			});
			return o.channel.edit({
				name: (o.mod.getConfig().name || "%username%'s channel").replace(
					'%username%',
					member.nick || member.username,
				),
			});
		}
	}
}
