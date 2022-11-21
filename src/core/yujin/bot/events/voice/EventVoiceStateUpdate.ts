import Eris from 'eris';

import { EventBase } from '../base/EventBase';

export default class EventVoiceStateUpdate extends EventBase {
	constructor() {
		super({
			name: 'voiceStateUpdateHandler',
			description: 'voice state update handler',
			event: 'voiceStateUpdate',
			process: async (member: Eris.Member, state: Eris.VoiceState) => {
				this.bot.mods.forEach((mod) => {
					mod.events?.onVoiceUpdate?.(member, state, { mod }).catch((e) =>
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
