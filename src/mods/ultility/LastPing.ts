import Eris from 'eris';

import Yujin from '../../core/yujin';

const pings: Map<
	string,
	{
		user: Eris.Member;
		time: number;
		cont: string;
		msid?: string;
	}
> = new Map();

export default class extends Yujin.Mod {
	constructor() {
		const description = 'Get your lastest ping from this server (or just use the mailbox feature)';

		super({
			name: 'Last Ping',
			group: 'Utility',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description,
			commands: [
				{
					name: 'lp',
					description,
					type: 'message',
					process: async (msg, opt) => {
						// proceed from here
						const data: any = {
							ping: pings.get(msg.author.id),
							embed: new Eris.Embed().setColor(msg.author.accentColor?.toString(16) || opt.mod.bot.color),
							message: await msg.channel.getMessage(pings.get(msg.author.id).msid).catch(() => undefined),
						};

						// if pinged
						if (data.ping) {
							data.embed.setAuthor(
								data.ping.user.tag(),
								data.message?.jumpLink,
								data.ping.user.avatarURL,
							);
							data.embed.setFooter(
								new Date(data.ping.time).toLocaleString('vi-VN', {
									timeZone: 'Asia/Ho_Chi_Minh',
								}),
							);
							data.embed.setDescription(`${data.ping.cont}`);
						} else {
							data.embed.setDescription('You have no ping');
						}

						// remove if configured
						if (this.getConfig().remove_on_command) {
							pings.delete(msg.author.id);
						}

						return msg.reply({
							embed: data.embed,
							messageReference: {
								messageID: msg.id,
							},
						});
					},
				},
				{
					name: 'lastping',
					description,
					type: 'slash',
					process: async (int) => {
						const data = {
							ping: pings.get((int.member || int.user).id),
							embed: new Eris.Embed().setColor(
								(int.member || int.user).accentColor?.toString(16) || this.bot.color,
							),
							message: await int.channel
								.getMessage(pings.get((int.member || int.user).id).msid)
								.catch(() => undefined),
						};

						// if pinged
						if (data.ping) {
							data.embed.setAuthor(
								data.ping.user.tag(),
								data.message?.jumpLink,
								data.ping.user.avatarURL,
							);
							data.embed.setFooter(
								new Date(data.ping.time).toLocaleString('vi-VN', {
									timeZone: 'Asia/Ho_Chi_Minh',
								}),
							);
							data.embed.setDescription(`${data.ping.cont}`);
						} else {
							data.embed.setDescription('You have no ping');
						}

						// remove if configured
						if (this.getConfig().remove_on_command) {
							pings.delete((int.member || int.user).id);
						}

						return int.createFollowup({
							embeds: [data.embed],
						});
					},
				},
			],
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateDefaultConfig({
							clean_interval: 14_400_000,
							remove_on_command: false,
						});

					setInterval(() => {
						for (const [u, i] of Array.from(pings.entries()))
							if (Date.now() - i.time >= this.getConfig().clean_interval) pings.delete(u);
					}, 10e3);
				},

				onMsgCreate: async (msg) => {
					// role mention
					msg.roleMentions?.forEach((role) => {
						msg.guild().members.forEach((member) => {
							if (member.roles.includes(role))
								pings.set(member.id, {
									user: msg.member,
									time: Date.now(),
									cont: msg.content,
									msid: msg.id,
								});
						});
					});

					// user mention
					msg.mentions?.forEach((m) => {
						pings.set(m.id, { user: msg.member, time: Date.now(), cont: msg.content, msid: msg.id });
					});
				},
			},
		});
	}
}
