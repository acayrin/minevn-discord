import fetch from 'node-fetch';
import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Ping',
			group: 'Core',
			description: 'Get bot reponse time',
			author: 'acayrin',
			commands: [
				{
					name: 'ping',
					description: 'Get bot reponse time',
					type: 'message',
					usage: '%prefix%%command%',
					process: async (m, o) => {
						const msg = await m.reply('Pinging...');

						const client = o.mod.bot.client;

						const t1 = Date.now();
						await fetch('https://discord.com/api/v9/');
						const t2 = Date.now() - t1;

						const tA1 = Date.now();
						await client.getRESTGuilds();
						const tA2 = Date.now() - tA1;

						const tB1 = Date.now();
						await client.getRESTUser(client.user.id);
						const tB2 = Date.now() - tB1;

						const tC1 = Date.now();
						await client.getRESTChannel(m.channel.id);
						const tC2 = Date.now() - tC1;

						msg.edit(
							[
								'```yaml',
								`Response time: `,
								`   avg: ${Math.round((t2 + tA2 + tB2 + tC2) / 4)} ms`,
								`     1: ${t2} ms`,
								`     2: ${tA2} ms`,
								`     3: ${tB2} ms`,
								`     4: ${tC2} ms`,
								'```',
							].join('\n'),
						);
					},
				},
			],
		});
	}
}
