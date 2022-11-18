import Eris from 'eris';

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Dig',
			group: 'Economy',
			description: [
				"Dig through messages and see what you'll get",
				'Range: 0 - 20',
				'',
				'Note:',
				'- You may get nothing',
				'- 10% chance of 2x amount',
			].join('\n'),
			cooldown: 3,
			commands: [
				{
					name: 'dig',
					description: "Dig through messages and see what you'll get",
					type: 'message',
					process: async (message, opt): Promise<unknown> => {
						if (message.author.bot || !opt.command) return;

						const { currency, database } = opt.mod.bot.database.get('economy', opt.mod);
						const data = {
							db: database as Yujin.Datastore,
							lucky_chance: Math.random(),
							amount: Math.floor(Math.random() * 21),
						};

						if (data.amount > 0) {
							// lucky chance
							if (data.lucky_chance <= 0.1) data.amount = data.amount * 2;
							await data.db.set({
								key: message.author.id,
								value: data.db.get(message.author.id) + data.amount,
							});
						}
						await message.reply({
							embed: new Eris.Embed()
								.setColor('#ffff44')
								.setTitle(
									data.amount === 0
										? 'Too bad...'
										: data.lucky_chance <= 0.1
										? 'Lucky! You got a double'
										: data.amount >= 15
										? 'Jackpot!'
										: 'Digging... ayo?',
								)
								.setDescription(
									`You found **__${data.amount.toLocaleString()}__** ${currency.toString()} while digging through messages`,
								),
						});
					},
				},
			],
		});
	}
}
