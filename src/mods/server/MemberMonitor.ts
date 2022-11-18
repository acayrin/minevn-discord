import Yujin from '../../core/yujin';

export default class MemberMonitor extends Yujin.Mod {
	constructor() {
		super({
			name: 'Member Monitor',
			group: 'Server',
			description: 'basically a user tracker',
			author: 'acayrin',
			intents: ['guilds', 'guildMembers'],
			icon: 'https://cdn.discordapp.com/emojis/724853518061797466.webp?size=1024&quality=lossless',
			events: {
				onMsgCreate: async (msg) => {
					if (!msg.author.bot) {
						const g = this.getDatastore().get(msg.author.id);

						this.getDatastore().set({
							key: msg.author.id,
							value: {
								lastActive: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
								usernames: g ? g.usernames : [msg.member.username],
							},
						});
					}
				},

				onUserChange: async (user, changes) => {
					const g: {
						usernames: string[];
						lastActive: string;
					} = this.getDatastore().get(user.id);
					this.getDatastore().set({
						key: user.id,
						value: {
							lastActive: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
							usernames:
								g && !g.usernames?.includes(changes.username)
									? [...g.usernames, changes.username]
									: [changes.username],
						},
					});
				},
			},
		});
	}
}
