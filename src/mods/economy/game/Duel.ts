import Eris from 'eris';

import Yujin from '../../../core/yujin';
import { invite } from '../utils/Invite';
import { Game } from './duel/Game';

const guide = new Eris.Embed()
	.setColor('#cccccc')
	.setTitle('Duel: Guide')
	.setDescription(
		[
			'Players will have 20 seconds to choose between Attack/Defend/Evade before each stage play\n',
			'Each action has its own dice roll value',
			'- Attack: range from 5 to 15',
			'- Defend: range from 9 to 12',
			'- Evade: range from 3 to 17\n',
			'These dice rolls will be taken place when the two players clash each other',
			'Depends on which action the players took, results are determined as\n',
			'> **Attack x Attack**',
			'> The player with higher dice roll deals damage to the other',
			'> If both dices rolled the same value, nothing will happen\n',
			'> **Attack x Defend**',
			'> The player with the Defend dice will take less damage depends',
			'> on their dice value comparing to the other',
			'> **Attack x Evade**',
			'> If the player with the Evade dice rolled equal or higher than the',
			"> opponent's dice, they'll deal subtracted amount of damage to their opponent",
			'> depends on their dice roll comparing to the other\n',
			'> **Defend/Evade x Defend/Evade**',
			'> Nothing will happen',
		].join('\n'),
	);

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Duel',
			group: 'Game',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description: '**Duel** with another user',
			cooldown: 60,
			commands: [
				{
					name: 'duel',
					description: 'Duel with another user',
					type: 'message',
					usage: '%prefix%%command% <user>',
					process: async (message: Eris.Message, opt): Promise<unknown> => {
						if (!opt.command) return;
						if (opt.args.length < 1) {
							return message
								.reply({
									content: 'You need to tag someone (or a bot) in order to play with them',
									components: new Eris.InteractionBuilder()
										.addButton({
											label: 'Help',
											emoji: '❓',
										})
										.toComponent(),
								})
								.then((m) => {
									m.interactionHandler({
										time: 30_000,
									})
										.on('interaction', async (e: Eris.ComponentInteraction) => {
											await e.createMessage({
												embeds: [guide],
												flags: 64,
											});
										})
										.on('end', async () => {
											await m.edit({
												components: [],
											});
										});
								});
						}
						const target = message.guild().getUser(opt.args.join(''));
						if (!target) return message.reply('Unable to find any matching user');
						if (target.id === message.author.id) return message.reply('What are you, a masochist?');

						// play the game
						if (
							message.channel instanceof Eris.TextChannel ||
							message.channel instanceof Eris.ThreadChannel ||
							message.channel instanceof Eris.TextVoiceChannel
						) {
							if (target.user.bot) {
								return new Game({ channel: message.channel, bot: opt.mod.bot })
									.addPlayer(message.author)
									.addPlayer(target.user)
									.start();
							} else {
								invite({
									game: this.name,
									message: message,
									target: target.user,
									amount: 0,
									database: undefined,
									currency: undefined,
								})
									.then(() => {
										return new Game({
											channel: message.channel as
												| Eris.TextChannel
												| Eris.ThreadChannel
												| Eris.TextVoiceChannel,
											bot: opt.mod.bot,
										})
											.addPlayer(message.author)
											.addPlayer(target.user)
											.start();
									})
									.catch(() => undefined);
							}
						}
					},
				},
			],
		});
	}
}
