import Eris from 'eris';

import Yujin from '../../../core/yujin';
import { validate } from '../utils/Validate';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Slots',
			group: ['Economy', 'Gamble'],
			description: [
				'Test your luck with the slots machine',
				'',
				'Note:',
				'- 3x Number 7 (1/10) will be 50x value',
				'- 3x Gold coin (2/10) will be 20x value',
				'- 3x Mango (3/10) will be 5x value',
				'- 3x Jerry (4/10) will be the same',
				'- Other chances will result as lose',
			].join('\n'),
			cooldown: 10,
			events: {
				onInit: async (mod) => {
					// setup emojis 7️⃣ 🪙 🥭 🍒
					emoji_data.slot_seven = {
						left: mod.bot.client.getEmoji('slots_left_7').shift() || '7️⃣',
						mid: mod.bot.client.getEmoji('slots_mid_7').shift() || '7️⃣',
					};
					emoji_data.slot_coin = {
						left: mod.bot.client.getEmoji('slots_left_coin').shift() || '🪙',
						mid: mod.bot.client.getEmoji('slots_mid_coin').shift() || '🪙',
					};
					emoji_data.slot_mango = {
						left: mod.bot.client.getEmoji('slots_left_mango').shift() || '🥭',
						mid: mod.bot.client.getEmoji('slots_mid_mango').shift() || '🥭',
					};
					emoji_data.slot_jerry = {
						left: mod.bot.client.getEmoji('slots_left_jerry').shift() || '🍒',
						mid: mod.bot.client.getEmoji('slots_mid_jerry').shift() || '🍒',
					};
					emoji_data.slot_spinning = {
						left: mod.bot.client.getEmoji('slots_spinning_left').shift() || '❓',
						mid: mod.bot.client.getEmoji('slots_spinning_mid').shift() || '❓',
					};
					emoji_data.slot_handle = mod.bot.client.getEmoji('slots_right_handle').shift();
				},
			},
			commands: [
				{
					name: 'slots',
					description: 'Test your luck with the slots machine',
					type: 'message',
					usage: '%prefix%%command% <amount>',
					process: async (message: Eris.Message, opt): Promise<unknown> => {
						if (!opt.command) return;

						// invalid args
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
							embed: new Eris.Embed().setColor('#44ee00'),
						};

						// validate data
						const val = await validate(data);
						if (!val) return;
						else data.amount = val.amount;

						// start
						return new Game(data).start();
					},
				},
			],
		});
	}
}

const emoji_data: {
	slot_seven: { left: Eris.GuildEmoji | string; mid: Eris.GuildEmoji | string };
	slot_coin: { left: Eris.GuildEmoji | string; mid: Eris.GuildEmoji | string };
	slot_mango: { left: Eris.GuildEmoji | string; mid: Eris.GuildEmoji | string };
	slot_jerry: { left: Eris.GuildEmoji | string; mid: Eris.GuildEmoji | string };
	slot_spinning: { left: Eris.GuildEmoji | string; mid: Eris.GuildEmoji | string };
	slot_handle: Eris.GuildEmoji;
} = {
	slot_seven: undefined,
	slot_coin: undefined,
	slot_mango: undefined,
	slot_jerry: undefined,
	slot_handle: undefined,
	slot_spinning: undefined,
};
enum Slot {
	seven = 1,
	coin = 2,
	mango = 3,
	jerry = 4,
}
function getEmo(slot: Slot) {
	return slot === Slot.seven
		? emoji_data.slot_seven
		: slot === Slot.coin
		? emoji_data.slot_coin
		: slot === Slot.mango
		? emoji_data.slot_mango
		: emoji_data.slot_jerry;
}
function roll() {
	const list = [
		Slot.seven,
		Slot.coin,
		Slot.coin,
		Slot.mango,
		Slot.mango,
		Slot.mango,
		Slot.jerry,
		Slot.jerry,
		Slot.jerry,
		Slot.jerry,
	];
	return list.at(Math.floor(Math.random() * list.length));
}

class Game {
	#data: {
		message: Eris.Message;
		database: Yujin.Datastore;
		currency: Eris.GuildEmoji;
		amount: number;
		min: number;
		max: number;
		embed: Eris.Embed;
	};
	#reels: {
		_1: Slot;
		_2: Slot;
		_3: Slot;
	} = {
		_1: undefined,
		_2: undefined,
		_3: undefined,
	};

	constructor(data: {
		message: Eris.Message;
		database: Yujin.Datastore;
		currency: Eris.GuildEmoji;
		amount: number;
		min: number;
		max: number;
		embed: Eris.Embed;
	}) {
		this.#data = data;
	}

	async start() {
		let msg = await this.#data.message.reply({
			content: [
				emoji_data.slot_spinning.left,
				emoji_data.slot_spinning.mid,
				emoji_data.slot_spinning.mid,
				emoji_data.slot_handle.toString(),
			].join(''),
			embed: new Eris.Embed().setTitle(`Rolling, please wait...`),
		});
		setTimeout(async () => {
			this.#reels._1 = roll();
			msg = await msg.edit({
				content: [
					getEmo(this.#reels._1).left,
					emoji_data.slot_spinning.mid,
					emoji_data.slot_spinning.mid,
					emoji_data.slot_handle.toString(),
				].join(''),
				embed: new Eris.Embed().setTitle(`Rolling, please wait...`),
			});
			setTimeout(async () => {
				this.#reels._2 = roll();
				msg = await msg.edit({
					content: [
						getEmo(this.#reels._1).left,
						getEmo(this.#reels._2).mid,
						emoji_data.slot_spinning.mid,
						emoji_data.slot_handle.toString(),
					].join(''),
					embed: new Eris.Embed().setTitle(`Rolling, please wait...`),
				});
				setTimeout(async () => {
					this.#reels._3 = roll();
					await this.#end(msg);
				}, 1_000);
			}, 1_000);
		}, 3_000);
	}

	async #end(msg: Eris.Message) {
		if (
			this.#reels._1 !== this.#reels._2 ||
			this.#reels._1 !== this.#reels._3 ||
			this.#reels._2 !== this.#reels._3
		) {
			await this.#data.database.set({
				key: this.#data.message.author.id,
				value: this.#data.database.get(this.#data.message.author.id) - this.#data.amount,
			});
			await msg.edit({
				content: [
					getEmo(this.#reels._1).left,
					getEmo(this.#reels._2).mid,
					getEmo(this.#reels._3).mid,
					emoji_data.slot_handle.toString(),
				].join(''),
				embed: this.#data.embed
					.setColor('#cc2222')
					.setTitle('Oops, better luck next time')
					.setDescription(
						`You lost **__${this.#data.amount.toLocaleString()}__** ${this.#data.currency.toString()}`,
					),
			});
		} else {
			switch (this.#reels._1) {
				case Slot.seven: {
					this.#data.amount = this.#data.amount * 50;
					this.#data.embed.setTitle('!!! JACKPOT !!!').setDescription('50x Total value');
					break;
				}
				case Slot.coin: {
					this.#data.amount = this.#data.amount * 20;
					this.#data.embed.setTitle('! Very lucky !').setDescription('20x Total value');
					break;
				}
				case Slot.mango: {
					this.#data.amount = this.#data.amount * 5;
					this.#data.embed.setTitle('Fruit rush').setDescription('5x Total value');
					break;
				}
				default: {
					this.#data.embed.setTitle('Maybe luckier next time').setDescription('');
				}
			}
			await this.#data.database.set({
				key: this.#data.message.author.id,
				value: this.#data.database.get(this.#data.message.author.id) + this.#data.amount,
			});
			await msg.edit({
				content: [
					getEmo(this.#reels._1).left,
					getEmo(this.#reels._2).mid,
					getEmo(this.#reels._3).mid,
					emoji_data.slot_handle.toString(),
				].join(''),
				embed: this.#data.embed.setDescription(
					`${
						this.#data.embed.description
					}\n\nYou won **__${this.#data.amount.toLocaleString()}__** ${this.#data.currency.toString()}`,
				),
			});
		}
	}
}
