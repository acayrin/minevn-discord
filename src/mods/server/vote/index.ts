import Yujin from '../../../core/yujin';
import { Init } from './Init';
import { VoteSomebody } from './VoteSombody';

export default class Vote extends Yujin.Mod {
	constructor() {
		super({
			name: 'Vote',
			group: 'Server',
			author: 'acayrin',
			intents: ['guilds', 'guildMembers', 'guildMessages', 'guildMessageReactions'],
			cooldown: 600,
			description: 'Vote somebody cuz democracy is kul',
			commands: [
				{
					name: 'vm',
					description: "Vote mute somebody if they're annoying",
					type: 'message',
					usage: '%prefix%%command% <user> [reason]',
					process: (msg, opt) => VoteSomebody(msg, opt),
				},
				{
					name: 'vum',
					description: 'Vote unmute somebody if you feel remorse for them',
					type: 'message',
					usage: '%prefix%%command% <user> [reason]',
					process: (msg, opt) => VoteSomebody(msg, opt, true),
				},
				{
					name: 'votemute',
					description: "Vote mute somebody if they're annoying",
					type: 'slash',
					options: [
						{ name: 'user', description: 'Target user', type: 3 },
						{ name: 'reason', description: 'Voting reason', type: 3 },
					],
					process: (i, o) => VoteSomebody(i, o),
				},
				{
					name: 'voteunmute',
					description: 'Vote unmute somebody if you feel remorse for them',
					type: 'slash',
					options: [
						{ name: 'user', description: 'Target user', type: 3 },
						{ name: 'reason', description: 'Voting reason', type: 3 },
					],
					process: (i, o) => VoteSomebody(i, o, true),
				},
			],
			events: {
				// check task
				onInit: Init,
			},
		});
	}
}
