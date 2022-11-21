import Eris from 'eris';

import { EventBase } from '../base/EventBase';

export default class EventMessageDelete extends EventBase {
	constructor() {
		super({
			name: 'messageDeleteHandler',
			description: 'message deletion event handler',
			event: 'messageDelete',
			process: async (message: Eris.Message) => {
				this.bot.mods.forEach((mod) => {
					mod.events?.onMsgDelete?.(message, { mod }).catch((e) =>
						this.bot.error({
							name: mod.name,
							message: e.message,
							cause: e.cause,
							stack: e.stack,
						}),
					);
				});
			},
		});
	}
}
