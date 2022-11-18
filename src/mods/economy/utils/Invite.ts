import Eris from 'eris';
import Yujin from '../../../core/yujin';

export async function invite(data: {
	game: string;
	message: Eris.Message;
	target: Eris.User;
	amount: number;
	database: Yujin.Datastore;
	currency: Eris.GuildEmoji;
}): Promise<{
	message?: Eris.Message;
	amount?: number;
	player_1?: Eris.User;
	player_2?: Eris.User;
	database?: Yujin.Datastore;
	currency?: Eris.GuildEmoji;
}> {
	return new Promise((resolve, reject) => {
		data.message
			.reply({
				content: data.target.mention,
				embed: new Eris.Embed()
					.setColor('#44eeaa')
					.setTitle(
						`${data.message.author.tag()} wants to challenge you in a game of ${
							data.game
						}. Will you accept?`,
					)
					.setDescription(
						`Betting amount: **__${data.amount}__** ${data.currency.toString()}\n Winner gets all`,
					),
				components: new Eris.InteractionBuilder()
					.addButton({
						label: 'Yes',
						style: 3,
						custom_id: 'invite_yes',
					})
					.addButton({
						label: 'No',
						style: 4,
						custom_id: 'invite_no',
					})
					.toComponent(),
			})
			.then((msg) => {
				const listener = msg.interactionHandler({
					filter: (e) => e.member.id === data.target.id,
					maxMatches: 1,
					time: 30_000,
				});
				listener.on('interaction', async (e: Eris.ComponentInteraction) => {
					await e.acknowledge();
					listener.stopListening(undefined);

					switch (e.data.custom_id) {
						case 'invite_yes': {
							await msg.edit({ content: '\u200B', components: [], embeds: [] });
							resolve({
								message: msg,
								amount: data.amount,
								player_1: data.message.author,
								player_2: data.target,
								database: data.database,
								currency: data.currency,
							});
							break;
						}
						case 'invite_no':
						default: {
							await msg.edit({
								content: '',
								embed: new Eris.Embed()
									.setColor('#880000')
									.setTitle(`${data.target.tag()} has declined the challenge`)
									.setDescription(`Betting cancelled`),
								components: [],
							});
							reject();
						}
					}
				});
				listener.on('end', async (_, reason: string) => {
					if (reason === 'time') {
						await msg.edit({
							content: '',
							embed: new Eris.Embed()
								.setColor('#880000')
								.setTitle(`Challenge cancelled due to timeout`)
								.setDescription(`Betting cancelled`),
							components: [],
						});
					}
					reject();
				});
			});
	});
}
