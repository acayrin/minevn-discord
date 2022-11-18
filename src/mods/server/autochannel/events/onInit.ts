import Eris from 'eris';

import Yujin from '../../../../core/yujin';

export async function onInit(o: { mod: Yujin.Mod }) {
	if (!o.mod.getConfig())
		o.mod.generateDefaultConfig({
			channels: ['976150648561238077', '838016418180104247'],
			interval: 10,
			name: "%username%'s channel",
		});

	setInterval(() => {
		for (const [channel] of o.mod.getDatastore().list('__GLOBAL__')) {
			const ch = o.mod.bot.client.getChannel(channel);
			if (ch instanceof Eris.VoiceChannel && ch.voiceMembers.size === 0) {
				ch.delete()
					.catch((e) =>
						o.mod.bot.error({
							name: o.mod.name,
							message: `Unable to delete channel ${ch.id}, perhaps it's already been deleted - ${e.message}`,
							cause: e.cause,
							stack: e.stack,
						}),
					)
					.finally(async () => {
						(await o.mod.getDatastore().remove(channel)).save();
						o.mod.bot.info(`[${o.mod.name}] Removed unused channel ${channel}`);
					});
			}
		}
	}, (o.mod.getConfig().interval || 10) * 1e3);
}
