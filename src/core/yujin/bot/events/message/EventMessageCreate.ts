import Eris from 'eris';

import Yujin from '../../..';
import { EventBase } from '../base/EventBase';

export default class EventMessageCreate extends EventBase {
	constructor() {
		super({
			name: 'messageCreate handler',
			description: 'message creation event handler',
			event: 'messageCreate',
			process: async (message: Eris.Message) => {
				const msg = message.content.slice(this.bot.prefix.length).trim(); // message without the prefix
				const isCommand = message.content.startsWith(this.bot.prefix); // is command?
				const args = msg.split(/ +/); // arguments
				const command = args.shift().toLowerCase(); // command

				// trigger mod command if match any
				if (isCommand && this.bot.commandManager.getMod(command) && !message.author.bot && !message.webhookID) {
					const mod = this.bot.commandManager.getMod(command);

					if (hasCommandCooldown(message.member || message.author, mod) > 0)
						return message.reply({
							content: `You're on cooldown for **${hasCommandCooldown(
								message.member || message.author,
								mod,
							)}** seconds`,
						});

					Promise.all(
						mod.commands
							?.filter((cmd) => cmd.name.toLowerCase() === command.toLowerCase())
							?.map(async (cmd) => {
								if (cmd.type === 'message')
									await cmd.process(message, { command, args, mod }).catch((e: Error) => {
										this.bot.error({
											name: mod.name,
											message: e.message,
											cause: e.cause,
											stack: e.stack,
										});
									});
							}),
					).catch(e => this.bot.error(e));
				}

				// trigger all mods as normal message
				Promise.all(
					this.bot.mods.map(async (mod) => {
						await mod.events?.onMsgCreate?.(message, { mod })?.catch((e: Error) =>
							this.bot.error({
								name: mod.name,
								message: e.message,
								cause: e.cause,
								stack: e.stack,
							}),
						);
					}),
				).catch(e => this.bot.error(e));
			},
		});
	}
}

export const commandCooldown: Map<string, number> = new Map();
export const hasCommandCooldown = (member: Eris.Member | Eris.User, mod: Yujin.Mod) => {
	// if mods, ignore
	if (member instanceof Eris.Member && member.permissions.has('manageGuild')) {
		return 0;
	}

	// normal
	if (mod.cooldown > 0) {
		const name = `${member.id}_${mod.name}`;
		const time = commandCooldown.get(name);

		if (time) {
			if (Date.now() - time > mod.cooldown * 1000) {
				commandCooldown.delete(name);
				return 0;
			} else {
				return Math.ceil((Date.now() - time) / 1000);
			}
		} else {
			commandCooldown.set(name, Date.now());
			return 0;
		}
	}
	return 0;
};
