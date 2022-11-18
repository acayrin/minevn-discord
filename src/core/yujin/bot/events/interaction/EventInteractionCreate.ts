import Eris from 'eris';

import { EventBase } from '../base/EventBase';

export default class EventMessageCreate extends EventBase {
	constructor() {
		super({
			name: 'interactionCreate handler',
			description: 'interaction creation event handler',
			event: 'interactionCreate',
			process: async (interaction: Eris.Interaction) => {
				if (interaction instanceof Eris.CommandInteraction) {
					await interaction.acknowledge();

					Promise.all(
						this.bot.mods.map((mod) =>
							mod.commands
								?.filter((cmd) => cmd.name.toLowerCase() === interaction.data.name.toLowerCase())
								?.map((cmd) => {
									if (cmd.type === 'slash')
										cmd.process(interaction, {
											mod,
											args: interaction.data.options || [],
											command: interaction.data.name,
										}).catch((e: Error) => {
											this.bot.error({
												name: mod.name,
												message: e.message,
												cause: e.cause,
												stack: e.stack,
											});
										});
								}),
						),
					);
				}
			},
		});
	}
}
