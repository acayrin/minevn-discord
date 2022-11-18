import Eris from 'eris';

import Yujin from '../../../core/yujin';
import { validate } from '../utils/Validate';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Coinflip',
			group: ['Economy', 'Gamble'],
			description: [
				'Bet your money by guessing Heads or Tails',
				'If you dont specify heads or tails, it will default to **heads**',
			].join('\n'),
			cooldown: 10,
			commands: [
				{
					name: 'flip',
					description: 'Bet your money by guessing Heads or Tails',
					type: 'message',
					usage: '%prefix%%command% <amount> [(h)eads/(t)ails]',
					process: async (message, opt) => {
						if (message.author.bot || !opt.command) return;
						if (opt.args.length < 1) return this.printInvalidUsage(message, opt.command, opt.mod.bot);

						const db = opt.mod.bot.database.get('economy', opt.mod);
						const data = {
							database: db.database as Yujin.Datastore,
							currency: db.currency as Eris.GuildEmoji,
							input: opt.args.at(0),
							amount: Math.abs(Number.parseFloat(opt.args.at(0))),
							min: (db.bet?.min as number) || 0,
							max: (db.bet?.max as number) || 100_000,
							player_1: message.author,
							player_2: opt.mod.bot.client.user,
							message: message,
							choice:
								opt.args.length > 1 ? (opt.args.shift().toLowerCase().includes('h') ? 'h' : 't') : 'h',
							embed: new Eris.Embed(),
							result: Math.random(),
						};

						// validate
						const val = await validate(data);
						if (!val) return;
						else data.amount = val.amount;

						if ((data.choice === 'h' && data.result < 0.5) || (data.choice === 't' && data.result >= 0.5)) {
							await data.database.set({
								key: message.author.id,
								value: data.database.get(message.author.id) + data.amount,
							});
							await message.reply({
								embed: data.embed
									.setColor('#88cc00')
									.setTitle(data.result < 0.5 ? 'Heads!' : 'Tails!')
									.setDescription(
										`You won **__${data.amount.toLocaleString()}__** ${data.currency.toString()}`,
									),
							});
						} else {
							await data.database.set({
								key: message.author.id,
								value: data.database.get(message.author.id) - data.amount,
							});
							await message.reply({
								embed: data.embed
									.setColor('#cc1100')
									.setTitle(data.result < 0.5 ? 'Heads!' : 'Tails!')
									.setDescription(
										`You lost **__${data.amount.toLocaleString()}__** ${data.currency.toString()}`,
									),
							});
						}
					},
				},
			],
		});
	}
}
