/* eslint-disable no-mixed-spaces-and-tabs */
import Eris from 'eris';

import Yujin from '../../../core/yujin';
import { invite } from '../utils/Invite';
import { validate } from '../utils/Validate';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Blackjack',
			group: ['Economy', 'Gamble'],
			description: [
				'Play **Blackjack** with the bot or another user',
				'',
				'Buttons:',
				'- **[Hit]** Draw a card from the deck',
				'- **[Stand]** End your turn without drawing any card',
				'- **[Drop]** Drop your deck and get back half the bet amount',
				'- **[Double]** Double your bet amount and draw one last card',
				'- **[View deck]** View your current hand',
				'',
				'Game rules:',
				'- Player with higher total card value win (**A**ce = 1/11, **J**ack/**Q**queen/**K**ing = 10)',
				'- If your total card value goes above 21, you instantly lose (Bust)',
				'- If you have an **A**ce and a **10**/**J**ack/**Q**ueen/**K**ing card, you instantly win (Blackjack)',
				'- If both players have Blackjack or equal deck value, the game ends as a draw',
			].join('\n'),
			cooldown: 60,
			events: {
				onInit: async (mod) => {
					for (const ele of ['spade', 'club', 'heart', 'diamond']) {
						for (const value of ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']) {
							const emoji = mod.bot.client.getEmoji(`card_${ele}_${value}`)?.shift();
							if (emoji) deck.set(`${ele}_${value}`, emoji.toString());
						}
					}

					// bad setup
					if (deck.size < 52)
						throw new Error(
							[
								'[ECO - Blackjack] Error: Incorrect deck size.',
								`Expected: [52], got [${deck.size}]\n`,
								'Please contact check if the emotes are setup correctly',
							].join(' '),
						);
				},
			},
			commands: [
				{
					name: 'bj',
					description: 'Play Blackjack with the bot or another user',
					type: 'message',
					usage: '%prefix%%command% <amount> [player]',
					process: async (message, opt) => {
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
							player_2: message.guild().getUser(opt.args.at(1))?.user || opt.mod.bot.client.user,
							message: message,
							channel: message.channel as Eris.TextChannel | Eris.ThreadChannel,
							emoji_card_back: opt.mod.bot.client.getEmoji('card_back').shift().toString(),
						};

						// validate data
						const val = await validate(data);
						if (!val) return;
						else data.amount = val.amount;

						// start
						if (!data.player_2.bot) {
							// send invitation and start game
							invite({
								game: 'Blackjack',
								message: message,
								amount: data.amount,
								target: data.player_2,
								database: data.database,
								currency: data.currency,
							})
								.then((obj) => {
									data.message = obj.message;
									return new Game(data).start();
								})
								.catch(() => undefined);
						} else {
							data.message = await message.reply('Setting up...');
							return new Game(data).start();
						}
					},
				},
			],
		});
	}
}

const deck: Map<string, string> = new Map();
class Game {
	#deck = new Map(deck);
	// GAME
	#players: {
		player_1: {
			deck: string[];
			user: Eris.User;
			stand: boolean;
			doubled: boolean;
		};
		player_2: {
			deck: string[];
			user: Eris.User;
			stand: boolean;
			doubled: boolean;
		};
	};
	#data: {
		database: Yujin.Datastore;
		currency: Eris.GuildEmoji;
		amount: number;
		player_1: Eris.User;
		player_2: Eris.User;
		message: Eris.Message;
		emoji_card_back: string;
	};

	/**
	 * Creates an instance of Blackjack Game.
	 * @author acayrin
	 * @param {{
	 * 		database: Yujin.Datastore;
	 * 		currency: Eris.GuildEmoji;
	 * 		amount: number;
	 * 		player_1: Eris.User;
	 * 		player_2: Eris.User;
	 * 		message: Eris.Message;
	 * 		emoji_card_back: string;
	 * 	}} data
	 * @memberof Game
	 */
	constructor(data: {
		database: Yujin.Datastore;
		currency: Eris.GuildEmoji;
		amount: number;
		player_1: Eris.User;
		player_2: Eris.User;
		message: Eris.Message;
		emoji_card_back: string;
	}) {
		this.#players = {
			player_1: { deck: [], user: data.player_1, stand: false, doubled: false },
			player_2: { deck: [], user: data.player_2, stand: false, doubled: false },
		};
		this.#data = data;
	}

	/**
	 * @description Draw a card and remove it from the deck
	 * @author acayrin
	 * @returns {string}
	 * @memberof Game
	 */
	#draw(): string {
		const card = Array.from(this.#deck.keys()).at(Math.floor(Math.random() * this.#deck.size));
		this.#deck.delete(card);
		return card;
	}

	/**
	 * @description Check if the 2 cards sum up as blackjack
	 * @author acayrin
	 * @param {string[]} cards
	 * @returns {*}  {boolean}
	 * @memberof Game
	 */
	#isBlackjack(cards: string[]): boolean {
		if (cards.length > 2) return false;
		return this.#total(cards) === 21;
	}

	/**
	 * @description Sum up total value of all cards in deck
	 * @author acayrin
	 * @param {string[]} cards
	 * @param {boolean} [oneJack]
	 * @returns {*}  {number}
	 * @memberof Game
	 */
	#total(cards: string[], oneJack?: boolean): number {
		let value = 0;
		let hasJack = false;
		for (const card of cards) {
			const card_value = card.split('_').pop();
			if (card_value === 'A') hasJack = true;
			value +=
				card_value === 'A'
					? oneJack
						? 1
						: 11
					: card_value === 'J' || card_value === 'Q' || card_value === 'K'
					? 10
					: Number(card_value);
		}
		return hasJack && !oneJack && value > 21 ? this.#total(cards, hasJack) : value;
	}

	/**
	 * @description Render deck with emojis
	 * @author acayrin
	 * @param {string[]} udeck
	 * @param {boolean} [hide]
	 * @returns {string}
	 * @memberof Game
	 */
	#renderDeck(udeck: string[], hide?: boolean): string {
		const res: string[] = [];
		udeck.forEach((card) => {
			res.push(hide ? this.#data.emoji_card_back : deck.get(card));
		});
		return res.join('');
	}

	/**
	 * @description End the game
	 * @author acayrin
	 * @param {(1 | 2)} winner
	 * @param {'timeout' | 'drop'} [reason]
	 * @memberof Game
	 */
	async #end(winner: 1 | 2, reason?: 'timeout' | 'drop') {
		if (reason?.includes('drop')) {
			this.#data.amount = Math.floor(this.#data.amount / 2);
		}
		const end = {
			winner: this.#players[winner === 1 ? 'player_1' : 'player_2'],
			loser: this.#players[winner === 1 ? 'player_2' : 'player_1'],
		};

		if (!end.loser.user.bot)
			await this.#data.database.set({
				key: end.loser.user.id,
				value:
					this.#data.database.get(end.loser.user.id) -
					(end.loser.doubled || end.winner.doubled ? 2 : 1) * this.#data.amount,
			});

		if (!end.winner.user.bot)
			await this.#data.database.set({
				key: end.winner.user.id,
				value:
					(this.#data.database.get(end.winner.user.id) || 0) +
					(end.loser.doubled || end.winner.doubled ? 2 : 1) * this.#data.amount,
			});

		await this.#data.message.edit({
			content: '',
			embed: new Eris.Embed()
				.setColor(winner === 1 ? '#00cc88' : '#cc2244')
				.setTitle(
					[
						`${end.winner.user.tag()} won`,
						reason?.includes('timeout')
							? ' due to their opponent being unresponsive for 5 minutes'
							: reason?.includes('drop')
							? ' due to their opponent giving up'
							: '',
					].join(''),
				)
				.setDescription(
					!this.#players.player_1.user.bot && !this.#players.player_2.user.bot
						? [
								`Transfered **__${(
									(end.loser.doubled || end.winner.doubled ? 2 : 1) * this.#data.amount
								).toLocaleString()}__** ${this.#data.currency} from`,
								` **${end.loser.user.tag()}** to`,
								` **${end.winner.user.tag()}**`,
						  ].join('')
						: [
								`${end.winner.user.bot ? 'Lost' : 'Reward'}`,
								`: **__${(
									(end.loser.doubled || end.winner.doubled ? 2 : 1) * this.#data.amount
								).toLocaleString()}__** ${this.#data.currency}`,
						  ].join(''),
				)
				.addField(
					`${this.#renderDeck(this.#players.player_1.deck)}`,
					`${this.#players.player_1.user.mention} [**${this.#total(this.#players.player_1.deck)}**]`,
					true,
				)
				.addField('\u200B', '\u200B', true)
				.addField(
					`${this.#renderDeck(this.#players.player_2.deck)}`,
					`${this.#players.player_2.user.mention} [**${this.#total(this.#players.player_2.deck)}**]`,
					true,
				),
			components: [],
		});
	}

	/**
	 * @description Start the turn at player
	 * @author acayrin
	 * @param {(1 | 2)} pos
	 * @memberof Game
	 */
	async #turn(pos: 1 | 2): Promise<unknown> {
		if (this.#players.player_1.stand && this.#players.player_2.stand) {
			const totals = {
				p1: this.#total(this.#players.player_1.deck),
				p2: this.#total(this.#players.player_2.deck),
			};
			if (totals.p1 === totals.p2) {
				return this.#data.message.edit({
					embed: new Eris.Embed()
						.setTitle("It's a draw")
						.setDescription('Since both got equal deck, nobody wins this round')
						.clearFields()
						.addField(
							`${this.#renderDeck(this.#players.player_1.deck)}`,
							`${this.#players.player_1.user.mention} [**${this.#total(this.#players.player_1.deck)}**]`,
							true,
						)
						.addField('\u200B', '\u200B', true)
						.addField(
							`${this.#renderDeck(this.#players.player_2.deck)}`,
							this.#players.player_2.user.mention +
								' [**' +
								this.#total(this.#players.player_2.deck) +
								'**]',
							true,
						),
					components: [],
				});
			} else if ((totals.p1 <= 21 && totals.p1 > totals.p2) || totals.p2 > 21) {
				return this.#end(1);
			} else if ((totals.p2 <= 21 && totals.p2 > totals.p1) || totals.p1 > 21) {
				return this.#end(2);
			}
		}

		const player = this.#players[`player_${pos}`];
		if (player.doubled) {
			return this.#turn(pos === 1 ? 2 : 1);
		}

		// reset
		player.stand = false;

		if (player.user.bot) {
			if (this.#total(player.deck) < 18) {
				player.deck.push(this.#draw());
			}

			if (this.#total(player.deck) > 21) {
				return this.#end(pos === 1 ? 2 : 1);
			} else if (this.#total(player.deck) >= 18) {
				player.stand = true;
			}

			return this.#turn(pos === 1 ? 2 : 1);
		}

		this.#data.message = await this.#data.message.edit({
			content: '',
			embed: new Eris.Embed()
				.setColor(pos === 1 ? '#00cc88' : '#cc2244')
				.setTitle(`${player.user.tag()} your turn`)
				.addField(
					`${this.#renderDeck(this.#players.player_1.deck, true)}`,
					`${this.#players.player_1.user.mention}`,
					true,
				)
				.addField('\u200B', '\u200B', true)
				.addField(
					`${this.#renderDeck(this.#players.player_2.deck, true)}`,
					`${this.#players.player_2.user.mention}`,
					true,
				),
			components: new Eris.InteractionBuilder()
				.addButton({
					label: 'Hit',
					custom_id: 'bj_hit',
					style: 2,
				})
				.addButton({
					label: 'Stand',
					custom_id: 'bj_stand',
					style: 2,
				})
				.addButton({
					label: 'Double',
					custom_id: 'bj_double',
					style: 3,
				})
				.addButton({
					label: 'Drop',
					custom_id: 'bj_drop',
					style: 4,
				})
				.addButton({
					label: 'View deck',
					custom_id: 'bj_view',
					style: 2,
				})
				.toComponent(),
		});

		const listener = this.#data.message.interactionHandler({
			filter: (e) =>
				e.member.id === this.#players.player_1.user.id || e.member.id === this.#players.player_2.user.id,
			time: 300_000,
		});
		listener.on('interaction', async (e: Eris.ComponentInteraction) => {
			if ((e.data.custom_id === 'bj_hit' || e.data.custom_id === 'bj_stand') && e.member.id !== player.user.id) {
				return e.createMessage({
					content: "It isn't your turn",
					flags: 64,
				});
			}

			switch (e.data.custom_id) {
				case 'bj_hit': {
					await e.acknowledge();
					listener.stopListening(undefined);

					player.deck.push(this.#draw());

					if (this.#total(player.deck) > 21) {
						this.#end(pos === 1 ? 2 : 1);
					} else {
						this.#turn(pos === 1 ? 2 : 1);
					}
					break;
				}
				case 'bj_stand': {
					await e.acknowledge();
					listener.stopListening(undefined);

					player.stand = true;
					this.#turn(pos === 1 ? 2 : 1);
					break;
				}
				case 'bj_double': {
					if (this.#data.database.get(e.member.id) < this.#data.amount * 2) {
						return e.createMessage({
							content: `You don't have **__${(this.#data.amount * 2).toLocaleString()}__** ${
								this.#data.currency
							} to play double`,
							flags: 64,
						});
					}
					if (
						!this.#players[`player_${pos === 1 ? 2 : 1}`].user.bot &&
						this.#data.database.get(this.#players[`player_${pos === 1 ? 2 : 1}`].user.id) <
							this.#data.amount * 2
					) {
						return e.createMessage({
							content: `Opponent doesn't have **__${(this.#data.amount * 2).toLocaleString()}__** ${
								this.#data.currency
							} to play double`,
							flags: 64,
						});
					}

					await e.acknowledge();
					listener.stopListening(undefined);

					player.stand = true;
					player.doubled = true;

					player.deck.push(this.#draw());

					if (this.#total(player.deck) > 21) {
						this.#end(pos === 1 ? 2 : 1);
					} else {
						this.#turn(pos === 1 ? 2 : 1);
					}
					break;
				}
				case 'bj_drop': {
					await e.acknowledge();
					listener.stopListening(undefined);

					this.#end(pos === 1 ? 2 : 1, 'drop');
					break;
				}
				case 'bj_view':
				default: {
					await e.createMessage({
						content: this.#renderDeck(
							e.member.id === this.#players.player_1.user.id
								? this.#players.player_1.deck
								: this.#players.player_2.deck,
						),
						embeds: [
							new Eris.Embed().setTitle(
								`Your deck [**${this.#total(
									e.member.id === this.#players.player_1.user.id
										? this.#players.player_1.deck
										: this.#players.player_2.deck,
								)}**]`,
							),
						],
						flags: 64,
					});
				}
			}
		});
		listener.on('end', (_, reason: string) => {
			if (reason === 'time') {
				this.#end(pos === 1 ? 2 : 1, 'timeout');
			}
		});
	}

	/**
	 * @description Start the game
	 * @author acayrin
	 * @memberof Game
	 */
	async start() {
		// Game starts here
		// add 2 cards
		this.#players.player_1.deck.push(this.#draw());
		this.#players.player_1.deck.push(this.#draw());
		this.#players.player_2.deck.push(this.#draw());
		this.#players.player_2.deck.push(this.#draw());

		if (this.#isBlackjack(this.#players.player_1.deck) && !this.#isBlackjack(this.#players.player_2.deck)) {
			return this.#end(1);
		} else if (this.#isBlackjack(this.#players.player_2.deck) && !this.#isBlackjack(this.#players.player_1.deck)) {
			return this.#end(2);
		} else if (this.#isBlackjack(this.#players.player_1.deck) && this.#isBlackjack(this.#players.player_2.deck)) {
			return this.#data.message.edit({
				embed: new Eris.Embed()
					.setTitle("It's a draw")
					.setDescription('Since both got blackjack, nobody wins this round')
					.addField(
						`${this.#renderDeck(this.#players.player_1.deck, true)}`,
						`${this.#players.player_1.user.mention}`,
						true,
					)
					.addField('\u200B', '\u200B', true)
					.addField(
						`${this.#renderDeck(this.#players.player_2.deck, true)}`,
						`${this.#players.player_2.user.mention}`,
						true,
					),
				components: [],
			});
		}

		await this.#turn(Math.random() < 0.5 ? 1 : 2);
	}
}
