import fetch from 'node-fetch';

import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Bot Status Message',
			group: 'Core',
			author: 'acayrin',
			description: 'Automated bot status message',
			events: {
				onInit: async (mod): Promise<void> => {
					setInterval(() => {
						const date = new Date();
						if (date.getSeconds() <= 20) {
							fetch('https://mcsrv.vercel.app/?ip=minevn.net')
								.then((res) =>
									res
										.text()
										.then(async (txt) => {
											const json = JSON.parse(txt);

											mod.bot.client.editStatus('online', {
												type: 0,
												name: `minevn.net (w/ ${json.onlinePlayers})`,
											});
										})
										.catch(() => {
											// empty catch block
										}),
								)
								.catch(() => {
									// empty catch block
								});
						} else if (date.getSeconds() <= 40) {
							mod.bot.client.editStatus('online', {
								type: 2,
								name: `-help for help`,
							});
						} else {
							mod.bot.client.editStatus('online', {
								type: 5,
								name: `MineVN w/ ${mod.bot.client.getUsers().length} users`,
							});
						}
					}, 10e3);
				},
			},
		});
	}
}
