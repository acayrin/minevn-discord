/* eslint-disable no-mixed-spaces-and-tabs */
import Eris from 'eris';

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Top Balance',
			group: 'Economy',
			description: 'Check for top balance ranking in the server',
			commands: [
				{
					name: 'baltop',
					description: 'Check for top balance ranking in the server',
					type: 'message',
					process: async (message, opt) => {
						if (!opt.command) return;

						const { currency, database } = opt.mod.bot.database.get('economy', opt.mod);
						const data: {
							db: Yujin.Datastore;
							embed: Eris.Embed;
							list: [string, number][];
						} = {
							db: database as Yujin.Datastore,
							embed: new Eris.Embed()
								.setColor('#aaee00')
								.setTitle('Top balance')
								.setThumbnail(message.guild().iconURL),
							list: database.list().__GLOBAL__,
						};

						data.list.sort(([, bal_1], [, bal_2]) => {
							return bal_2 - bal_1;
						});

						let i = 0;
						while (i < (data.list.length < 12 ? data.list.length : 12)) {
							const rank = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
							data.embed.addField(
								`${rank} ${message.guild().getUser(data.list[i][0]).tag()}`,
								`**${data.db.get(data.list[i][0]).toLocaleString()}** ${currency}`,
								true,
							);
							i++;
						}

						return message.reply({
							embed: data.embed,
						});
					},
				},
			],
		});
	}
}
