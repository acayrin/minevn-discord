import Eris from 'eris';

import { EventBase } from '../base/EventBase';

export default class EventMessageUpdate extends EventBase {
	constructor() {
		super({
			name: 'messageUpdateHandler',
			description: 'message update event handler',
			event: 'messageUpdate',
			process: async (newMessage: Eris.Message, oldMessage: Eris.OldMessage) => {
				await Promise.all(
					this.bot.mods.map((mod) => {
						mod.events?.onMsgUpdate?.(newMessage, oldMessage, { mod }).catch((e) =>
							this.bot.error({
								name: mod.name,
								message: e.message,
								cause: e.cause,
								stack: e.stack,
							}),
						);
					}),
				);
			},
		});
	}
}
