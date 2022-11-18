import Eris from 'eris';

import Yujin from '../../core/yujin';

const hex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const respose = [
	'I give it a solid **$P**',
	'**$P**, damn son where did you find this',
	'Take this, **$P**, now go',
	'I rate it **$P**',
	'*Zamn*  **$P**',
	'**$P**   🔍👀',
	'**$P**   👀👍 cool bro',
];
export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Rate',
			description: 'Rate a user by given term',
			icon: 'https://cdn.discordapp.com/emojis/513332190612815873.gif?size=128',
			commands: [
				{
					name: 'rate',
					description: 'Rate a user by given term',
					usage: '%prefix%%command% [term][,user]',
					type: 'message',
					process: async (message, opt) => {
						const long = opt.args.join(' ').split(',');
						const term = long.shift().trim();
						const user = long.length > 0 ? message.guild().getUser(long.pop().trim()) : message.author;
						const rate = Math.round(Math.random() * 100);

						return message.reply({
							embed: new Eris.Embed()
								.setAuthor(user.tag(), null, user.avatarURL)
								.setTitle(term)
								.setDescription(
									respose[Math.floor(respose.length * Math.random())].replace('$P', `${rate}%`),
								)
								.setColor(`#${hex(6)}`),
						});
					},
				},
				{
					name: 'rate',
					description: 'Rate a user by given term',
					type: 'slash',
					options: [
						{
							name: 'term',
							description: 'String to rate for',
							type: 3,
							required: true,
						},
						{
							name: 'user',
							description: 'User to rate',
							type: 3,
						},
					],
					process: async (i, opt) => {
						const term = (opt.args.find((o) => o.name === 'term') as any).value;
						const user =
							i.guild().getUser((opt.args.find((o) => o.name === 'user') as any)?.value) ||
							i.member ||
							i.user;
						const rate = Math.round(Math.random() * 100);

						return i.createFollowup({
							embeds: [
								new Eris.Embed()
									.setAuthor(user.tag(), null, user.avatarURL)
									.setTitle(term)
									.setDescription(
										respose[Math.floor(respose.length * Math.random())].replace('$P', `${rate}%`),
									)
									.setColor(`#${hex(6)}`),
							],
						});
					},
				},
			],
		});
	}
}
