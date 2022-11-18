import Eris from 'eris';

import Yujin from '../../../../core/yujin';

export async function onVoiceJoin(o: { mem: Eris.Member; channel: Eris.VoiceChannel; mod: Yujin.Mod }) {
	const list: string[] = o.mod.getConfig().channels;
	const cat = o.mem.guild.channels.get(o.channel.id).parentID;

	// ignore invalid member
	// ignore bot users
	// ignore no category
	// ignore channels that arent in config
	if (!o.mem || o.mem.bot || !cat || !list.includes(o.channel.id)) return;

	await o.mod.bot.client
		.createChannel(
			o.mem.guild.id,
			(o.mod.getConfig().name || "%username%'s channel").replace('%username%', o.mem.nick || o.mem.username),
			2,
			{
				parentID: cat,
			},
		)
		.then(async (ch) => {
			o.mod.bot.info(`[${o.mod.name}] Created new channel ${ch.id}`);

			await o.mem
				.edit({ channelID: ch.id })
				.then(() => {
					o.mod.getDatastore().set({
						key: ch.id,
						value: o.mem.id,
					});
				})
				.catch((e) => {
					o.mod.bot.error({
						name: o.mod.name,
						message: `Error moving member ${o.mem.id} - ${e.message}`,
						cause: e.cause,
						stack: e.stack,
					});
					ch.delete();
				});
		})
		.catch((e: Error) =>
			o.mod.bot.error({
				name: o.mod.name,
				message: `Error creating voice channel - ${e.message}`,
				cause: e.cause,
				stack: e.stack,
			}),
		);
}
