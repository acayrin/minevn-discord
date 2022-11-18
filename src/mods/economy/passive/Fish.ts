import Eris from 'eris';

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Fish',
			group: 'Economy',
			description: [
				"Go fishing and see what you'll catch",
				'Range: 0 - 250',
				'',
				'Note:',
				'- You may get nothing',
				'- 2% chance of 20x amount',
				'- 10% chance of 2x amount',
			].join('\n'),
			cooldown: 20,
			commands: [
				{
					name: 'fish',
					description: "Go fishing and see what you'll catch",
					type: 'message',
					process: async (message, opt): Promise<unknown> => {
						if (message.author.bot || !opt.command) return;

						const { currency, database } = opt.mod.bot.database.get('economy', opt.mod);
						const data = {
							db: database as Yujin.Datastore,
							lucky_chance: Math.random(),
							amount: Math.floor(Math.random() * 251),
						};

						if (data.amount > 0) {
							// super lucky chance
							if (data.lucky_chance <= 0.02) data.amount = data.amount * 20;
							else if (data.lucky_chance <= 0.1) data.amount = data.amount * 2;
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
										? 'Aww the fish got away...'
										: data.lucky_chance <= 0.02
										? 'Aahhh You got a big catch! 20x value'
										: data.lucky_chance <= 0.1
										? 'Two for one? Nice catch, double value'
										: data.amount >= 150
										? 'Hey, some decent catch there'
										: 'Fishing... small fry',
								)
								.setDescription(
									`You found **__${data.amount.toLocaleString()}__** ${currency.toString()} while fishing`,
								),
							components: [],
						});
					},
				},
			],
		});
	}
}
