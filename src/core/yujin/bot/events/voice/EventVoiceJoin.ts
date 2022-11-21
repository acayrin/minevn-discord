import Eris from 'eris';

import { EventBase } from '../base/EventBase';

export default class EventVoiceJoin extends EventBase {
	constructor() {
		super({
			name: 'voiceChannelJoinHandler',
			description: 'voice channel join event handler',
			event: 'voiceChannelJoin',
			process: async (member: Eris.Member, channel: Eris.VoiceChannel | Eris.StageChannel) => {
				this.bot.mods.forEach((mod) => {
					mod.events?.onVoiceJoin?.(member, channel, { mod }).catch((e) =>
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
