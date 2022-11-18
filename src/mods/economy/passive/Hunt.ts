import Eris from 'eris';

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Hunt',
			group: 'Economy',
			description: [
				'Go hunting and see what can you get',
				'Range: 0 - 500',
				'',
				'Note:',
				'- You may get nothing',
				'- 1% chance of 10x amount',
				'- 20% chance of 1.5x amount',
			].join('\n'),
			cooldown: 20,
			commands: [
				{
					name: 'hunt',
					description: 'Go hunting and see what can you get',
					type: 'message',
					process: async (message, opt): Promise<unknown> => {
						if (message.author.bot || !opt.command) return;

						const { currency, database } = opt.mod.bot.database.get('economy', opt.mod);
						const data = {
							db: database as Yujin.Datastore,
							lucky_chance: Math.random(),
							amount: Math.floor(Math.random() * 501),
						};

						if (data.amount > 0) {
							// lucky chance
							if (data.lucky_chance <= 0.01) data.amount = data.amount * 10;
							else if (data.lucky_chance <= 0.2) data.amount = data.amount * 1.5;
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
										: data.lucky_chance <= 0.01
										? 'Madlad - 10x value'
										: data.lucky_chance <= 0.2
										? 'Lucky hunter - 1.5x value'
										: data.amount >= 300
										? 'Decent hunt for the week'
										: 'Enough for today',
								)
								.setDescription(
									`You found **__${data.amount.toLocaleString()}__** ${currency.toString()} while hunting`,
								),
						});
					},
				},
			],
		});
	}
}
