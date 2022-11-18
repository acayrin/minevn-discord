import Eris from 'eris';
import Yujin from '../../../../core/yujin';

enum Choice {
	attack = '⚔️ Attack',
	defend = '🛡️ Defend',
	evade = '👟 Evade',
}

export class Game {
	#bot: Yujin.Bot;
	#channel: Eris.TextChannel | Eris.ThreadChannel | Eris.TextVoiceChannel;
	#players: Array<{
		user: Eris.User;
		choice: string;
		hp: number;
		stagger: number;
	}> = [];
	#reuse: {
		embed: Eris.Embed;
		components: Eris.ActionRow[];
		message: Eris.Message;
	};

	constructor(o: { bot: Yujin.Bot; channel: Eris.TextChannel | Eris.ThreadChannel | Eris.TextVoiceChannel }) {
		this.#bot = o.bot;
		this.#channel = o.channel;
	}

	addPlayer(user: Eris.User): Game {
		this.#players.push({
			user,
			choice: null,
			hp: 100,
			stagger: 50,
		});

		return this;
	}

	async start() {
		await this.#setup();
		await this.#playTurn();
	}

	async #setup() {
		this.#reuse = {
			embed: new Eris.Embed()
				.setColor('#cc2244')
				.setTitle(`Duel: **${this.#players.at(0).user.tag()}** vs **${this.#players.at(1).user.tag()}**`),
			components: new Eris.InteractionBuilder()
				.addButton({
					label: 'Attack',
					custom_id: Choice.attack,
					emoji: '⚔️',
				})
				.addButton({
					label: 'Defend',
					custom_id: Choice.defend,
					emoji: '🛡️',
				})
				.addButton({
					label: 'Evade',
					custom_id: Choice.evade,
					emoji: '👟',
				})
				.addButton({
					label: 'Run away',
					custom_id: 'duel_end',
					emoji: '💨',
					style: 4,
				})
				.toComponent(),
			message: await this.#channel.createMessage('Setting up...'),
		};
	}

	async #playTurn(index = 0): Promise<unknown> {
		if (index === 2) return await this.#playStage();

		const player = this.#players.at(index);
		// play against bots
		if (player.user.bot) {
			const rand = Math.random();
			this.#players[index] = {
				user: player.user,
				choice: rand >= 0.75 ? Choice.evade : rand >= 0.5 ? Choice.defend : Choice.attack,
				hp: player.hp,
				stagger: player.stagger,
			};
			return await this.#playTurn(++index);
		}

		this.#reuse.message = await this.#reuse.message.edit({
			content: '',
			embed: this.#reuse.embed
				.clearFields()
				.setColor(index === 0 ? '#00cc88' : '#cc2244')
				.setDescription(`${player.user.mention} your turn.\nYou have 20 seconds.`)
				.addField(
					`${this.#players.at(0).user.tag()}`,
					`${this.#renderHealthbar({ percent: this.#players.at(0).hp })} ${this.#players.at(0).hp}`,
					true,
				)
				.addField('\u200B', '\u200B', true)
				.addField(
					`${this.#players.at(1).user.tag()}`,
					`${this.#renderHealthbar({ percent: this.#players.at(1).hp })} ${this.#players.at(1).hp}`,
					true,
				),
			components: this.#reuse.components,
		});

		this.#reuse.message
			.interactionHandler({
				filter: (e) => player.user.id === e.member.id,
				maxMatches: 1,
				time: 20_000,
			})
			.on('interaction', async (e: Eris.ComponentInteraction) => {
				switch (e.data.custom_id) {
					case Choice.attack: {
						this.#players[index] = {
							user: player.user,
							choice: Choice.attack,
							hp: player.hp,
							stagger: player.stagger,
						};
						break;
					}
					case Choice.defend: {
						this.#players[index] = {
							user: player.user,
							choice: Choice.defend,
							hp: player.hp,
							stagger: player.stagger,
						};
						break;
					}
					case Choice.evade: {
						this.#players[index] = {
							user: player.user,
							choice: Choice.evade,
							hp: player.hp,
							stagger: player.stagger,
						};
						break;
					}
					default: {
						return this.#reuse.message.edit({
							embed: this.#reuse.embed
								.setDescription(
									`🎉 ${
										this.#players.at(index === 0 ? 1 : 0).user.mention
									} won by their opponent running away`,
								)
								.clearFields(),
							components: [],
						});
					}
				}
				await e.acknowledge();
				await this.#playTurn(++index);
			})
			.on('end', async (_, reason: string) => {
				if (reason === 'time') {
					return this.#reuse.message.edit({
						embed: this.#reuse.embed
							.setDescription(
								`🎉 ${
									this.#players.at(index === 0 ? 1 : 0).user.mention
								} won by their opponent giving up`,
							)
							.clearFields(),
						components: [],
					});
				}
			});
	}

	#roll(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	async #playStage(): Promise<void> {
		const player_1 = this.#players[0];
		const player_2 = this.#players[1];
		const roll_1 =
			player_1.choice === Choice.attack
				? this.#roll(5, 15) // attack - 5 / 15
				: player_1.choice === Choice.defend
				? this.#roll(9, 12) // defend - 9 / 12
				: this.#roll(3, 17); // evade - 3 / 17
		const roll_2 =
			player_2.choice === Choice.attack
				? this.#roll(5, 15) // attack - 5 / 15
				: player_2.choice === Choice.defend
				? this.#roll(9, 12) // defend - 9 / 12
				: this.#roll(3, 17); // evade - 3 / 17

		switch (player_1.choice) {
			// player 1 attack
			case Choice.attack: {
				switch (player_2.choice) {
					// player 2 attack
					case Choice.attack: {
						if (roll_1 > roll_2) {
							this.#reuse.embed.setDescription(`${player_2.user.mention} took ${roll_1} damage.`);
							this.#players[1] = {
								user: player_2.user,
								choice: undefined,
								hp: player_2.hp - roll_1,
								stagger: player_2.stagger,
							};
						} else if (roll_2 > roll_1) {
							this.#reuse.embed.setDescription(`${player_1.user.mention} took ${roll_2} damage.`);
							this.#players[0] = {
								user: player_1.user,
								choice: undefined,
								hp: player_1.hp - roll_2,
								stagger: player_1.stagger,
							};
						} else {
							this.#reuse.embed.setDescription('Equal clash - no damage was done.');
						}
						break;
					}
					// player 2 defend
					case Choice.defend: {
						const defended = roll_1 - roll_2 < 0 ? 0 : roll_1 - roll_2;
						this.#reuse.embed.setDescription(`${player_2.user.mention} took ${defended} damage.`);
						this.#players[1] = {
							user: player_2.user,
							choice: undefined,
							hp: player_2.hp - defended,
							stagger: player_2.stagger,
						};
						break;
					}
					// player 2 evade
					case Choice.evade: {
						if (roll_1 > roll_2) {
							this.#reuse.embed.setDescription(`${player_2.user.mention} took ${roll_1} damage.`);
							this.#players[1] = {
								user: player_2.user,
								choice: undefined,
								hp: player_2.hp - roll_1,
								stagger: player_1.stagger,
							};
						} else {
							const deflect = roll_2 - roll_1;
							this.#reuse.embed.setDescription(
								`${player_2.user.mention} evaded the attack.\n Deflect ${deflect} damage to ${player_1.user.mention}.`,
							);
							this.#players[0] = {
								user: player_1.user,
								choice: undefined,
								hp: player_1.hp - deflect,
								stagger: player_1.stagger,
							};
						}
						break;
					}
				}
				break;
			}
			// player 1 defend
			case Choice.defend: {
				switch (player_2.choice) {
					// player 2 attack
					case Choice.attack: {
						const defended = roll_2 - roll_1 < 0 ? 0 : roll_2 - roll_1;
						this.#reuse.embed.setDescription(`${player_1.user.mention} took ${defended} damage.`);
						this.#players[0] = {
							user: player_1.user,
							choice: undefined,
							hp: player_1.hp - defended,
							stagger: player_1.stagger,
						};
						break;
					}
					// player 2 defend
					// player 2 evade
					case Choice.defend:
					case Choice.evade: {
						this.#reuse.embed.setDescription('Both players chose defend/evade.\nNo action was taken.');
						break;
					}
				}
				break;
			}
			// player 1 evade
			case Choice.evade: {
				switch (player_2.choice) {
					// player 2 attack
					case Choice.attack: {
						if (roll_2 > roll_1) {
							this.#reuse.embed.setDescription(`${player_1.user.mention} took ${roll_2} damage.`);
							this.#players[0] = {
								user: player_1.user,
								choice: undefined,
								hp: player_1.hp - roll_2,
								stagger: player_1.stagger,
							};
						} else {
							const deflect = roll_1 - roll_2;
							this.#reuse.embed.setDescription(
								`${player_1.user.mention} evaded the attack.\n Deflect ${deflect} damage to ${player_2.user.mention}.`,
							);
							this.#players[1] = {
								user: player_2.user,
								choice: undefined,
								hp: player_2.hp - deflect,
								stagger: player_2.stagger,
							};
						}
						break;
					}
					// player 2 defend
					// player 2 evade
					case Choice.defend:
					case Choice.evade: {
						this.#reuse.embed.setDescription('Both players chose defend/evade.\nNo action was taken.');
						break;
					}
				}
				break;
			}
		}

		// message
		this.#reuse.message = await this.#reuse.message.edit({
			embed: this.#reuse.embed
				.clearFields()
				.addField(`Rolled: ${roll_1} 🎲`, player_1.choice, true)
				.addField('\u200B', '\u200B', true)
				.addField(`Rolled: ${roll_2} 🎲`, player_2.choice, true)
				.addField(
					`${this.#players.at(0).user.tag()}`,
					`${this.#renderHealthbar({ percent: this.#players.at(0).hp })} ${this.#players.at(0).hp}`,
					true,
				)
				.addField('\u200B', '\u200B', true)
				.addField(
					`${this.#players.at(1).user.tag()}`,
					`${this.#renderHealthbar({ percent: this.#players.at(1).hp })} ${this.#players.at(1).hp}`,
					true,
				),
			components: [],
		});

		setTimeout(async () => {
			if (this.#players.at(0).hp <= 0) {
				await this.#reuse.message.edit({
					embed: this.#reuse.embed.setDescription(`🎉 ${player_2.user.mention} won the duel!`).clearFields(),
					components: [],
				});
			} else if (this.#players.at(1).hp <= 0) {
				await this.#reuse.message.edit({
					embed: this.#reuse.embed.setDescription(`🎉 ${player_1.user.mention} won the duel!`).clearFields(),
					components: [],
				});
			} else {
				await this.#playTurn();
			}
		}, 5_000);
	}

	#renderHealthbar({ percent }: { percent: number }): string {
		const res: string[] = [];
		if (percent >= 95) res.unshift(this.#bot.client.getEmoji('hp_right_full').shift().toString());
		else if (percent >= 90) res.unshift(this.#bot.client.getEmoji('hp_right_half').shift().toString());
		else res.unshift(this.#bot.client.getEmoji('hp_right_empty').shift().toString());

		if (percent >= 80) res.unshift(this.#bot.client.getEmoji('hp_center_full').shift().toString());
		else if (percent >= 75) res.unshift(this.#bot.client.getEmoji('hp_center_half').shift().toString());
		else res.unshift(this.#bot.client.getEmoji('hp_center_empty').shift().toString());
		if (percent >= 65) res.unshift(this.#bot.client.getEmoji('hp_center_full').shift().toString());
		else if (percent >= 60) res.unshift(this.#bot.client.getEmoji('hp_center_half').shift().toString());
		else res.unshift(this.#bot.client.getEmoji('hp_center_empty').shift().toString());
		if (percent >= 50) res.unshift(this.#bot.client.getEmoji('hp_center_full').shift().toString());
		else if (percent >= 45) res.unshift(this.#bot.client.getEmoji('hp_center_half').shift().toString());
		else res.unshift(this.#bot.client.getEmoji('hp_center_empty').shift().toString());
		if (percent >= 35) res.unshift(this.#bot.client.getEmoji('hp_center_full').shift().toString());
		else if (percent >= 30) res.unshift(this.#bot.client.getEmoji('hp_center_half').shift().toString());
		else res.unshift(this.#bot.client.getEmoji('hp_center_empty').shift().toString());
		if (percent >= 20) res.unshift(this.#bot.client.getEmoji('hp_center_full').shift().toString());
		else if (percent >= 15) res.unshift(this.#bot.client.getEmoji('hp_center_half').shift().toString());
		else res.unshift(this.#bot.client.getEmoji('hp_center_empty').shift().toString());

		if (percent >= 5) res.unshift(this.#bot.client.getEmoji('hp_left_full').shift().toString());
		else if (percent >= 2.5) res.unshift(this.#bot.client.getEmoji('hp_left_half').shift().toString());
		else res.unshift(this.#bot.client.getEmoji('hp_left_empty').shift().toString());

		return res.join('');
	}
}
