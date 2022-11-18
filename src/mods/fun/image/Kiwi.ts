import Eris from 'eris';

import Yujin from '../../../core/yujin';

const kiwis = [
	'https://i.kym-cdn.com/photos/images/original/001/263/042/cab.jpg',
	'https://img.buzzfeed.com/buzzfeed-static/static/2017-08/16/17/tmp/buzzfeed-prod-web-04/tmp-name-2-31487-1502920343-3_dblbig.jpg?resize=1200:*',
	'https://img.buzzfeed.com/buzzfeed-static/static/2017-08/14/15/asset/buzzfeed-prod-web-04/sub-buzz-2783-1502739685-1.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto',
	'https://i.pinimg.com/564x/9f/58/3f/9f583fc0e800f8062fb2aa593f8b51ca.jpg',
];

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Kiwi',
			group: 'Kiwi',
			description: 'Kiwi',
			icon: 'https://minotar.net/avatar/CursedKiwi',
			commands: [
				{
					name: 'kiwi',
					description: 'kiwi',
					type: 'slash',
					process: (i) => {
						return i.reply({
							embeds: [
								new Eris.Embed()
									.setTitle('Kiwi')
									.setImage(kiwis[Math.floor(Math.random() * kiwis.length)])
									.setColor('#00cc00')
									.setAuthor('Kiwi'),
							],
						});
					},
				},
				{
					name: 'kiwi',
					description: 'kiwi',
					type: 'message',
					process: (i) => {
						return i.reply({
							embeds: [
								new Eris.Embed()
									.setTitle('Kiwi')
									.setImage(kiwis[Math.floor(Math.random() * kiwis.length)])
									.setColor('#00cc00')
									.setAuthor('Kiwi'),
							],
						});
					},
				},
			],
		});
	}
}
