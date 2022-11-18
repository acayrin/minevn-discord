import Eris from 'eris';

import { EventBase } from '../base/EventBase';

export default class EventMessageDelete extends EventBase {
	constructor() {
		super({
			name: 'messageDeleteHandler',
			description: 'message deletion event handler',
			event: 'messageDelete',
			process: async (message: Eris.Message) => {
				await Promise.all(
					this.bot.mods.map((mod) => {
						mod.events?.onMsgDelete?.(message, { mod }).catch((e) =>
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
