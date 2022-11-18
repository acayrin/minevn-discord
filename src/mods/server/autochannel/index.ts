import Yujin from '../../../core/yujin';
import { onInit } from './events/onInit';
import { onMessageCreate } from './events/onMessageCreate';
import { onVoiceJoin } from './events/onVoiceJoin';
import { onVoiceLeave } from './events/onVoiceLeave';
import { onVoiceSwitch } from './events/onVoiceSwitch';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Auto Channel',
			group: 'Utility',
			author: 'acayrin',
			intents: ['guilds', 'guildVoiceStates', 'guildMembers'],
			description: 'Auto create and manage voice channels',
			icon: 'https://cdn.icon-icons.com/icons2/2518/PNG/512/stack_icon_151083.png',
			cooldown: 5,
			commands: [
				{
					name: 'ac',
					description: 'Use the subcommand ``help`` for more info',
					type: 'message',
					usage: '%prefix%%command% <subcommand> [...args]',
					process: (msg, opt) => onMessageCreate(this, msg, opt),
				},
			],
			events: {
				onInit: (mod) => onInit({ mod }),

				onVoiceLeave: async (_, channel, opt) =>
					onVoiceLeave({
						channel,
						mod: opt.mod,
					}),

				onVoiceSwitch: async (mem, newChannel, oldChannel, opt) =>
					onVoiceSwitch({
						mem,
						newChannel,
						oldChannel,
						mod: opt.mod,
					}),

				onVoiceJoin: async (mem, channel, opt) =>
					onVoiceJoin({
						mem,
						channel,
						mod: opt.mod,
					}),
			},
		});
	}
}
