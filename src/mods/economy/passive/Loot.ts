import Eris from 'eris';

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Loot',
			group: 'Economy',
			description: [
				"Go looting and see what you'll get",
				'Range: 0 - 50',
				'',
				'Note:',
				'- You may get nothing',
				'- 1% chance of 30x amount',
				'- 5% chance of 10x amount',
				'- 20% chance of 2x amount',
			].join('\n'),
			cooldown: 10,
			commands: [
				{
					name: 'loot',
					description: "Go looting and see what you'll get",
					type: 'message',
					process: async (message, opt): Promise<unknown> => {
						if (message.author.bot || !opt.command) return;

						const { currency, database } = opt.mod.bot.database.get('economy', opt.mod);
						const data = {
							db: database as Yujin.Datastore,
							lucky_chance: Math.random(),
							amount: Math.floor(Math.random() * 51),
						};

						if (data.amount > 0) {
							// super lucky chance
							if (data.lucky_chance <= 0.01) data.amount = data.amount * 30;
							else if (data.lucky_chance <= 0.05) data.amount = data.amount * 10;
							else if (data.lucky_chance <= 0.2) data.amount = data.amount * 2;
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
										? 'Found nothing but scrap...'
										: data.lucky_chance <= 0.01
										? 'You found Treasure! 30x value'
										: data.lucky_chance <= 0.05
										? 'Rare loot, worth a pile. 10x value'
										: data.lucky_chance <= 0.2
										? 'You found some extra loot. 2x value'
										: data.amount >= 300
										? 'Made a fortune'
										: 'Better than nothing...',
								)
								.setDescription(
									`You found **__${data.amount.toLocaleString()}__** ${currency.toString()} while looting`,
								),
							components: [],
						});
					},
				},
			],
		});
	}
}
