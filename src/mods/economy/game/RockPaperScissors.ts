import Eris from 'eris';

import Yujin from '../../../core/yujin';
import { invite } from '../utils/Invite';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Rock, Paper, Scissors',
			group: ['Game', 'Economy'],
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description: [
				'Play **Rock, Paper, Scissors** with another user',
				'',
				'__(Available if Eco mod is loaded and playing with a user)__',
				'If you add in an amount, it will be used as a prize for the winner',
				'If you lose, the amount of money you bet will be given to the other player',
			].join('\n'),
			cooldown: 30,
			commands: [
				{
					name: 'rps',
					description: 'Play Rock, Paper, Scissors with another user',
					type: 'message',
					usage: '%prefix%%command% <user> [amount]',
					process: async (message: Eris.Message, opt): Promise<unknown> => {
						if (!opt.command) return;
						if (opt.args.length < 0) return this.printInvalidUsage(message, opt.command, opt.mod.bot);

						const target = message.guild().getUser(opt.args.shift())?.user || opt.mod.bot.client.user;

						// if economy mod is loaded
						if (opt.mod.bot.database.has('economy') && !target.bot) {
							const data = {
								amount: Math.abs(Number(opt.args.at(0))),
								target: target,
								database: opt.mod.bot.database.get('economy', opt.mod).database as Yujin.Datastore,
								currency: opt.mod.bot.database.get('economy', opt.mod).currency as Eris.GuildEmoji,
								embed: new Eris.Embed(),
							};

							if (Number.isNaN(data.amount)) {
								return message.reply(`**${opt.args.at(0)}** is not a valid number`);
							}
							if (data.database.get(target.id) < data.amount) {
								return message.reply(
									`**${target.tag()}** doesn't have enough **__${
										data.amount
									}__** ${data.currency.toString()} to play`,
								);
							}

							invite({
								game: 'Rock, Paper, Scissors',
								message: message,
								amount: data.amount,
								target: data.target,
								database: data.database,
								currency: data.currency,
							})
								.then((obj) => {
									return new Game({
										message: obj.message,
										player_1: message.author,
										player_2: data.target,
										eco: {
											database: data.database,
											amount: data.amount,
											currency: data.currency.toString(),
										},
									}).start();
								})
								.catch(() => undefined);
						} else {
							return new Game({
								message: await message.reply('Setting up...'),
								player_1: message.author,
								player_2: target,
							}).start();
						}
					},
				},
			],
		});
	}
}

enum Choice {
	rock = '🪨 Rock',
	paper = '☁️ Paper',
	scissors = '✂️ Scissors',
}

class Game {
	#message: Eris.Message;
	#player_1: Eris.User;
	#player_2: Eris.User;
	#eco: {
		database: Yujin.Datastore;
		amount: number;
		currency: string;
	};

	constructor(o: {
		message: Eris.Message;
		player_1: Eris.User;
		player_2: Eris.User;
		eco?: {
			database: Yujin.Datastore;
			amount: number;
			currency: string;
		};
	}) {
		this.#message = o.message;
		this.#player_1 = o.player_1;
		this.#player_2 = o.player_2;
		if (o.eco) {
			this.#eco = o.eco;
		}
	}

	async start() {
		const eco = this.#eco;
		const players: {
			user: Eris.User;
			choice: string;
		}[] = [];
		players.push({
			user: this.#player_1,
			choice: null,
		});
		players.push({
			user: this.#player_2,
			choice: null,
		});

		const reuse = {
			msg: this.#message,
			embed: new Eris.Embed()
				.setColor('#00cc88')
				.setTitle(`${players.at(0).user.username} vs ${players.at(1).user.username}`),
			components: new Eris.InteractionBuilder()
				.addButton({
					label: 'Rock',
					custom_id: Choice.rock,
					emoji: '🪨',
				})
				.addButton({
					label: 'Paper',
					custom_id: Choice.paper,
					emoji: '☁️',
				})
				.addButton({
					label: 'Scissors',
					custom_id: Choice.scissors,
					emoji: '✂️',
				})
				.toComponent(),
		};

		await (async function turn(index: number): Promise<unknown> {
			if (index === 2) return end();
			const player = players.at(index);

			if (player.user.bot) {
				const rand = Math.random();
				players[index] = {
					user: player.user,
					choice: rand >= 0.66 ? Choice.rock : rand >= 0.33 ? Choice.paper : Choice.scissors,
				};

				return turn(index === 0 ? 1 : 2);
			}

			reuse.msg = await reuse.msg.edit({
				content: '',
				embed: reuse.embed.setDescription(`${player.user.mention} your turn\nYou have 10 seconds`),
				components: reuse.components,
			});

			reuse.msg
				.interactionHandler({
					filter: (e) => player.user.id === e.member.id,
					maxMatches: 1,
					time: 10_000,
				})
				.on('interaction', async (e: Eris.ComponentInteraction) => {
					switch (e.data.custom_id) {
						case Choice.rock: {
							players[index] = {
								user: player.user,
								choice: Choice.rock,
							};
							break;
						}
						case Choice.paper: {
							players[index] = {
								user: player.user,
								choice: Choice.paper,
							};
							break;
						}
						case Choice.scissors: {
							players[index] = {
								user: player.user,
								choice: Choice.scissors,
							};
							break;
						}
						default: {
							players[index] = {
								user: player.user,
								choice: Choice.rock,
							};
						}
					}
					await e.createMessage({
						content: `You chose ${e.data.custom_id}`,
						flags: 64,
					});
					await turn(index === 0 ? 1 : 2);
				})
				.on('end', async (_, reason: string) => {
					if (reason === 'time') {
						const ply = {
							_1: players.at(index),
							_2: players.at(index === 0 ? 1 : 0),
						};
						if (eco) {
							await eco.database.set({
								key: ply._2.user.id,
								value: (eco.database.get(ply._2.user.id) || 0) + eco.amount,
							});
							await eco.database.set({
								key: ply._1.user.id,
								value: (eco.database.get(ply._1.user.id) || 0) - eco.amount,
							});
							reuse.embed.setDescription(
								`Transferred **__${eco.amount.toLocaleString()}__** ${eco.currency} from ${
									ply._1.user.mention
								} to ${ply._2.user.mention}`,
							);
						}
						return reuse.msg.edit({
							embed: reuse.embed.setTitle(`${ply._2.user.tag()} won by their opponent giving up`),
							components: [],
						});
					}
				});
		})(0);

		async function end(): Promise<unknown> {
			reuse.embed
				.setDescription(null)
				.addField(players.at(0).user.username, players.at(0).choice, true)
				.addField('\u200B', '\u200B', true)
				.addField(players.at(1).user.username, players.at(1).choice, true);

			if (
				(players.at(0).choice === Choice.rock && players.at(1).choice === Choice.rock) ||
				(players.at(0).choice === Choice.paper && players.at(1).choice === Choice.paper) ||
				(players.at(0).choice === Choice.scissors && players.at(1).choice === Choice.scissors)
			) {
				return reuse.msg.edit({
					embed: reuse.embed.setTitle("It's a tie, nobody win"),
					components: [],
				});
			}

			if (
				(players.at(0).choice === Choice.rock && players.at(1).choice === Choice.scissors) ||
				(players.at(0).choice === Choice.paper && players.at(1).choice === Choice.rock) ||
				(players.at(0).choice === Choice.scissors && players.at(1).choice === Choice.paper)
			) {
				if (eco) {
					await eco.database.set({
						key: players.at(0).user.id,
						value: (eco.database.get(players.at(0).user.id) || 0) + eco.amount,
					});
					await eco.database.set({
						key: players.at(1).user.id,
						value: (eco.database.get(players.at(1).user.id) || 0) - eco.amount,
					});
					reuse.embed.setDescription(
						`Transferred **__${eco.amount.toLocaleString()}__** ${eco.currency} from ${
							players.at(1).user.mention
						} to ${players.at(0).user.mention}`,
					);
				}
				return reuse.msg.edit({
					embed: reuse.embed.setTitle(`${players.at(0).user.username} won`),
					components: [],
				});
			}

			if (
				(players.at(1).choice === Choice.rock && players.at(0).choice === Choice.scissors) ||
				(players.at(1).choice === Choice.paper && players.at(0).choice === Choice.rock) ||
				(players.at(1).choice === Choice.scissors && players.at(0).choice === Choice.paper)
			) {
				if (eco) {
					await eco.database.set({
						key: players.at(1).user.id,
						value: (eco.database.get(players.at(1).user.id) || 0) + eco.amount,
					});
					await eco.database.set({
						key: players.at(0).user.id,
						value: (eco.database.get(players.at(0).user.id) || 0) - eco.amount,
					});
					reuse.embed.setDescription(
						`Transferred **__${eco.amount.toLocaleString()}__** ${eco.currency} from ${
							players.at(0).user.mention
						} to ${players.at(1).user.mention}`,
					);
				}
				return reuse.msg.edit({
					embed: reuse.embed.setTitle(`${players.at(1).user.tag()} won`),
					components: [],
				});
			}
		}
	}
}
