import Eris from 'eris';

import { EventBase } from '../base/EventBase';

export default class EventVoiceLeave extends EventBase {
	constructor() {
		super({
			name: 'voiceChannelLeaveHandler',
			description: 'voice channel leave event handler',
			event: 'voiceChannelLeave',
			process: async (member: Eris.Member, channel: Eris.VoiceChannel | Eris.StageChannel) => {
				this.bot.mods.forEach((mod) => {
					mod.events?.onVoiceLeave?.(member, channel, { mod }).catch((e) =>
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
