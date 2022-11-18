import Eris from 'eris';

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Pay',
			group: 'Economy',
			description: 'Pay another user from your balance',
			cooldown: 30,
			commands: [
				{
					name: 'pay',
					description: 'Pay another user from your balance',
					usage: '%prefix%%command% <user> <amount>',
					type: 'message',
					process: async (message, opt) => {
						if (!opt.command) return;
						if (opt.args.length < 2) return this.printInvalidUsage(message, opt.command, opt.mod.bot);

						// data
						const data = {
							target: message.guild().getUser(opt.args?.shift()),
							amount: Math.abs(Number(opt.args?.at(0))),
							database: opt.mod.bot.database.get('economy', opt.mod).database as Yujin.Datastore,
							currency: opt.mod.bot.database.get('economy', opt.mod).currency as Eris.GuildEmoji,
						};

						// validate
						if (!data.target) return message.reply("Can't find any matching user");
						if (Number.isNaN(data.amount))
							return message.reply(`**${opt.args?.at(0)}** is not a valid number`);
						if (data.database.get(message.author.id) < data.amount)
							return message.reply(
								`You don't have enough **__${data.amount.toLocaleString()}__** ${data.currency.toString()} to pay`,
							);

						// set data
						await data.database.set({
							key: data.target.id,
							value: (data.database.get(data.target.id) || 0) + data.amount,
						});
						await data.database.set({
							key: message.author.id,
							value: data.database.get(message.author.id) - data.amount,
						});

						// logging
						opt.mod.bot.info(
							`[${this.name}] Transaction ${message.author.id} -> ${
								data.target.id
							} : ${data.amount.toLocaleString()}`,
						);

						return message.reply(
							`You paid **${data.target.tag()}** **__${data.amount.toLocaleString()}__** ${data.currency.toString()}`,
						);
					},
				},
			],
		});
	}
}
