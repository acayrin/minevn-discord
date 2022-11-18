import { exec } from 'child_process';
import { resolve } from 'path';
import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		const description = "Fetch the bot's output log, for the bot owner that is";

		super({
			name: 'Logs',
			group: 'Core',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description,
			commands: [
				{
					name: 'log',
					description,
					type: 'message',
					process: async (m, o) => {
						if (!o.command || m.author.id !== '448046610723766273') return;

						exec(`/usr/bin/tail -n 500 ${resolve('./')}/logs/latest.log`, (err, out) => {
							if (err) return m.report(err, __filename);
							return m.reply('', {
								file: Buffer.from(out, 'utf-8'),
								name: 'log.txt',
							});
						});
					},
				},
				{
					name: 'log',
					description,
					type: 'slash',
					process: async (i) => {
						if ((i.member || i.user).id !== '448046610723766273') return;

						exec(`/usr/bin/tail -n 500 ${resolve('./')}/logs/latest.log`, async (err, out) => {
							if (err) return (await i.getOriginalMessage()).report(err, __filename);
							return i.createFollowup('', {
								file: Buffer.from(out, 'utf-8'),
								name: 'log.txt',
							});
						});
					},
				},
			],
		});
	}
}
