import Eris from 'eris';
import fetch from 'node-fetch';

import Yujin from '../../core/yujin';
import { seen } from '../core/Monitor';

export default class extends Yujin.Mod {
	constructor() {
		const description = "Get a member's information";

		super({
			name: 'Member Info',
			group: 'Utility',
			description,
			intents: ['guilds', 'guildMembers'],
			icon: 'https://cdn.discordapp.com/emojis/724853518061797466.webp?size=1024&quality=lossless',
			cooldown: 10,
			commands: [
				{
					name: 'info',
					description,
					usage: '%prefix%%command% [user]',
					type: 'message',
					process: (msg, opt) => this.process(msg, opt),
				},
				{
					name: 'info',
					description,
					type: 'slash',
					options: [
						{
							name: 'user',
							description: 'User to get info from',
							type: 3,
						},
					],
					process: (i, o) => this.process(i, o),
				},
			],
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateConfig({
							user_token: process.env.MINEVN_ANTIPIG_TOKEN || 'insert a user token here',
						});
				},
			},
		});
	}

	private async process(
		i: Eris.Message | Eris.CommandInteraction,
		opt: { mod: Yujin.Mod; args: (string | Eris.InteractionDataOptions)[]; command: string },
	) {
		const g = i instanceof Eris.Message ? i.guild() : i.guild();
		const u =
			opt.args.length < 1
				? i.member
				: opt.args.every((o) => typeof o === 'string')
				? g.getUser(opt.args.join(' '))
				: g.getUser(
						(opt.args as Eris.InteractionDataOptionWithValue[]).find((o) => o.name === 'user')
							.value as string,
				  );
		const db = opt.mod.bot.mods.find((mod) => mod.name === 'Member Monitor').getDatastore();

		const o = {
			roles: '',
			lastActive: db.get(u.id)?.lastActive || '2077',
			totalToday: seen.find((i) => i.id.includes(u.id))?.count || 0,
			usernames: (db.get(u.id)?.usernames || [u.username]).join(', '),
		};

		u.roles.forEach((_r) => {
			if (g.roles.get(_r).name !== '@everyone') o.roles += `${g.roles.get(_r).mention} `;
		});

		const m = JSON.parse(
			await (
				await fetch(
					`https://discord.com/api/v9/guilds/${i.guildID}/messages/search?author_id=${u.id}&include_nsfw=true`,
					{
						method: 'GET',
						headers: {
							authorization: this.getConfig().user_token,
							'user-agent':
								'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
						},
					},
				)
			).text(),
		).total_results;

		return i instanceof Eris.Message
			? i.reply({
					embed: new Eris.Embed()
						.setColor(this.bot.color)
						.setAuthor(`${u.tag()}`, undefined, u.avatarURL)
						.addField(
							'bday',
							new Date(u.user.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
							true,
						)
						.addField(
							'joined',
							new Date(u.joinedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
							true,
						)
						.addField('msg (total)', `${m} messages`, true)
						.addField('names', o.usernames, true)
						.addField('last active', o.lastActive, true)
						.addField('msg (today)', o.totalToday.toString(), true)
						.addField('roles', o.roles)
						.setFooter(`ID: ${u.id}`),
			  })
			: i.createFollowup({
					embeds: [
						new Eris.Embed()
							.setColor(this.bot.color)
							.setAuthor(`${u.tag()}`, undefined, u.avatarURL)
							.addField(
								'bday',
								new Date(u.user.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
								true,
							)
							.addField(
								'joined',
								new Date(u.joinedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
								true,
							)
							.addField('msg (total)', `${m} messages`, true)
							.addField('names', o.usernames, true)
							.addField('last active', o.lastActive, true)
							.addField('msg (today)', o.totalToday.toString(), true)
							.addField('roles', o.roles)
							.setFooter(`ID: ${u.id}`),
					],
			  });
	}
}
