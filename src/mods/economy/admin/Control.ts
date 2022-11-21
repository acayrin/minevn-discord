import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'EcoAdmin',
			group: 'Economy',
			description: "Control a user's money amount",
			commands: [
				{
					name: 'eco_give',
					description: 'Give a user a specific amount of money',
					type: 'message',
					usage: '%prefix%%command% <user> <amount>',
					process: async (message, opt) => {
						if (
							message.author.id !== '448046610723766273' &&
							!message.member?.roles.includes('371537555734396928')
						)
							return;
						if (opt.args.length < 1) return this.printInvalidUsage(message, opt.command, opt.mod.bot);

						const target = message.guild().getUser(opt.args?.shift());
						if (!target) return message.reply("Can't find any matching user");

						const amount = Number(opt.args?.shift());
						if (Number.isNaN(amount)) return message.reply(`${amount} is not a valid number`);

						const db: Yujin.Datastore = opt.mod.bot.database.get('economy', opt.mod).database;
						const { currency } = opt.mod.bot.database.get('economy', opt.mod);

						await db.set({
							key: target.id,
							value: (db.get(target.id) || 0) + amount,
						});
						return message.reply(
							`${target.tag()} now has **__${db
								.get(target.id)
								.toLocaleString()}__** ${currency.toString()}`,
						);
					},
				},
				{
					name: 'eco_take',
					description: 'Take a specific amount of money from a user',
					type: 'message',
					usage: '%prefix%%command% <user> <amount>',
					process: async (message, opt) => {
						if (
							message.author.id !== '448046610723766273' &&
							!message.member?.roles.includes('371537555734396928')
						)
							return;
						if (opt.args.length < 1) return this.printInvalidUsage(message, opt.command, opt.mod.bot);

						const target = message.guild().getUser(opt.args?.shift());
						if (!target) return message.reply("Can't find any matching user");

						const amount = Number(opt.args?.shift());
						if (Number.isNaN(amount)) return message.reply(`${amount} is not a valid number`);

						const db: Yujin.Datastore = opt.mod.bot.database.get('economy', opt.mod).database;
						const { currency } = opt.mod.bot.database.get('economy', opt.mod);

						await db.set({
							key: target.id,
							value: db.get(target.id) >= amount ? db.get(target.id) - amount : 0,
						});
						return message.reply(
							`${target.tag()} now has **__${db
								.get(target.id)
								.toLocaleString()}__** ${currency.toString()}`,
						);
					},
				},
				{
					name: 'eco_set',
					description: 'Set a user to have a specific amount of money',
					type: 'message',
					usage: '%prefix%%command% <user> <amount>',
					process: async (message, opt) => {
						if (
							message.author.id !== '448046610723766273' &&
							!message.member?.roles.includes('371537555734396928')
						)
							return;
						if (opt.args.length < 1) return this.printInvalidUsage(message, opt.command, opt.mod.bot);

						const target = message.guild().getUser(opt.args?.shift());
						if (!target) return message.reply("Can't find any matching user");

						const amount = Number(opt.args?.shift());
						if (Number.isNaN(amount)) return message.reply(`${amount} is not a valid number`);

						const db: Yujin.Datastore = opt.mod.bot.database.get('economy', opt.mod).database;
						const { currency } = opt.mod.bot.database.get('economy', opt.mod);

						await db.set({
							key: target.id,
							value: amount,
						});
						return message.reply(
							`${target.tag()} now has **__${db
								.get(target.id)
								.toLocaleString()}__** ${currency.toString()}`,
						);
					},
				},
			],
		});
	}
}
