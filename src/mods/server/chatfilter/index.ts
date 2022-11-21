import Yujin from '../../../core/yujin';
import { ChatFilter } from './ChatFilter';
import { defaultList } from './DefaultList';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Chat Filter',
			group: 'Server',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages', 'guildMembers', 'guildWebhooks'],
			description: 'Filter bad words from chat',
			priority: -1, // run at last
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateConfig({
							bypass_roles: [],
							replace: {
								normal: '<:mvncat:861078127551971338>',
								fallback: '🤡',
							},
							method: 'webhook',
							list: defaultList,
						});
				},
				onMsgCreate: (message, opt) => ChatFilter(message, opt.mod),
				onMsgUpdate: (newMsg, _, opt) => ChatFilter(newMsg, opt.mod),
			},
		});
	}
}
