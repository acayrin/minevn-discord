import Eris from 'eris';

import { EventBase } from '../base/EventBase';

export default class EventVoiceSwitch extends EventBase {
	constructor() {
		super({
			name: 'voiceChannelSwitchHandler',
			description: 'voice channel switch event handler',
			event: 'voiceChannelSwitch',
			process: async (
				member: Eris.Member,
				newChannel: Eris.VoiceChannel | Eris.StageChannel,
				oldChannel: Eris.VoiceChannel | Eris.StageChannel,
			) => {
				this.bot.mods.forEach((mod) => {
					mod.events?.onVoiceSwitch?.(member, newChannel, oldChannel, { mod }).catch((e) =>
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
