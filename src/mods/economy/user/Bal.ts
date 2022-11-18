/* eslint-disable no-mixed-spaces-and-tabs */

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Balance',
			group: 'Economy',
			description: 'Check for your or another user current balance',
			commands: [
				{
					name: 'bal',
					description: 'Check for your or another user current balance',
					type: 'message',
					usage: '%prefix%%command% [user]',
					process: async (message, opt): Promise<unknown> => {
						if (!opt.command) return;

						const { currency, database } = opt.mod.bot.database.get('economy', opt.mod);
						const data = {
							db: database as Yujin.Datastore,
							target: message.guild().getUser(opt.args.shift()),
						};

						return !data.target
							? message.reply(
									`You currently have **__${data.db
										.get(message.author.id)
										.toLocaleString()}__** ${currency.toString()}`,
							  )
							: message.reply(
									`**${data.target.tag()}** currently has **__${data.db
										.get(data.target.id)
										.toLocaleString()}__** ${currency.toString()}`,
							  );
					},
				},
			],
		});
	}
}
