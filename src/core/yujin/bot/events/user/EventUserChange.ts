import Eris from 'eris';

import { EventBase } from './../base/EventBase';

export default class EventUserChange extends EventBase {
	constructor() {
		super({
			name: 'userUpdateHandler',
			description: 'handler for user changes',
			event: 'userUpdate',
			process: async (
				user: Eris.User,
				changes: {
					username: string;
					avatar: string;
					discriminator: string;
				},
			) => {
				Promise.all(
					this.bot.mods.map((mod) => {
						mod.events?.onUserChange?.(user, changes, { mod }).catch((e) =>
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
