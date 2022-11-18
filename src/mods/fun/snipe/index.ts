import Eris from 'eris';
import Yujin from '../../../core/yujin';
import { onInteraction } from './events/onInteraction';
import { onMessageCreate } from './events/onMessageCreate';
import { onMessageDelete } from './events/onMessageDelete';
import { onMessageUpdate } from './events/onMessageUpdate';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Snipe',
			group: 'Fun',
			author: 'acayrin',
			intents: ['guilds', 'guildMembers', 'guildMessages'],
			description: 'Pro Message Sniper',
			commands: [
				{
					name: 's',
					description: 'Snipe a recently deleted message',
					usage: '%prefix%%command% [index]',
					type: 'message',
					process: onMessageCreate,
				},
				{
					name: 'es',
					description: 'Snipe a recently editted message',
					usage: '%prefix%%command% [index]',
					type: 'message',
					process: onMessageCreate,
				},
				{
					name: 'clear',
					description: 'Clear the snipe cache, need "Manage Messages" permission',
					type: 'message',
					process: onMessageCreate,
				},
				{
					name: 'snipe',
					description: 'Snipe a recently deleted message',
					type: 'slash',
					options: [
						{
							name: 'index',
							description: 'Index to look for',
							type: 4,
						},
					],
					process: onInteraction,
				},
				{
					name: 'editsnipe',
					description: 'Snipe a recently editted message',
					type: 'slash',
					options: [
						{
							name: 'index',
							description: 'Index to look for',
							type: 4,
						},
					],
					process: onInteraction,
				},
				{
					name: 'clear',
					description: 'Clear the snipe cache, need "Manage Messages" permission',
					type: 'slash',
					process: onInteraction,
				},
			],
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateDefaultConfig({
							limit: 30,
						});
					this.bot.client.on('messageDeleteBulk', (messages) => {
						messages.forEach((message) => {
							if (message instanceof Eris.Message) onMessageDelete(message, { mod: this });
						});
					});
				},
				onMsgDelete: (msg) => onMessageDelete(msg, { mod: this }),
				onMsgUpdate: (newMsg, oldMsg) => onMessageUpdate(newMsg, oldMsg, { mod: this }),
			},
		});
	}
}
