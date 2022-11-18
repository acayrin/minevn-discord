/* eslint-disable @typescript-eslint/no-explicit-any */
import Eris from 'eris';
import fetch from 'node-fetch';

import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		const description = 'Show information based on given snowflake / ID';

		super({
			name: 'Snowflake',
			group: 'Core',
			description,
			author: 'acayrin',
			intents: ['guilds', 'guildMembers', 'guildMessages', 'guildMessageReactions'],
			cooldown: 20,
			commands: [
				{
					name: 'snowflake',
					description,
					type: 'message',
					usage: '%prefix%%command% <snowflake>',
					process: (m, o) => this.process(m, o),
				},
				{
					name: 'sf',
					description,
					type: 'message',
					usage: '%prefix%%command% <snowflake>',
					process: (m, o) => this.process(m, o),
				},
				{
					name: 'snowflake',
					description,
					type: 'slash',
					options: [
						{
							name: 'snowflake',
							description: 'Unique ID to search for',
							type: 3,
							required: true,
						},
					],
					process: (i, o) => this.process(i, o),
				},
			],
		});
	}

	private async process(
		i: Eris.Message | Eris.CommandInteraction,
		opt: { mod: Yujin.Mod; args: (string | Eris.InteractionDataOptions)[]; command: string },
	) {
		// get the snowflake
		const id = opt.args.every((o) => typeof o === 'string') ? opt.args.shift() : (opt.args as any[])[0].value;
		const guild = i instanceof Eris.Message ? i.guild() : i.guild();

		if (guild.getRole(id)) {
			const role = guild.getRole(id);
			await (i instanceof Eris.Message ? i.reply : i.channel.createMessage)({
				embed: new Eris.Embed()
					.setTitle(`Role: ${role.name}`)
					.setDescription(`Allow: ${role.permissions.allow}\nDeny: ${role.permissions.deny}`)
					.setColor(role.color.toString(16))
					.setThumbnail(role.iconURL),
			});
		} else if (guild.getUser(id)) {
			const user = guild.getUser(id);
			if (i instanceof Eris.Message)
				await i.reply({
					embed: new Eris.Embed()
						.setTitle(`Member: ${user.tag()}`)
						.setColor(user.accentColor?.toString(16) || '#ee99cc')
						.setImage(user.avatarURL)
						.setDescription(
							`Joined: ${new Date(user.joinedAt).toLocaleString('vi-VN', {
								timeZone: 'Asia/Ho_Chi_Minh',
							})}\nAvatar: [Link](${user.avatarURL})\nBanner: [Link](${user.bannerURL})`,
						),
				});
			else
				await i.createFollowup({
					embeds: [
						new Eris.Embed()
							.setTitle(`Member: ${user.tag()}`)
							.setColor(user.accentColor?.toString(16) || '#ee99cc')
							.setImage(user.avatarURL)
							.setDescription(
								`Joined: ${new Date(user.joinedAt).toLocaleString('vi-VN', {
									timeZone: 'Asia/Ho_Chi_Minh',
								})}\nAvatar: [Link](${user.avatarURL})\nBanner: [Link](${user.bannerURL})`,
							),
					],
				});
		} else if (guild.channels.has(id)) {
			const channel = guild.channels.get(id);
			if (i instanceof Eris.Message)
				await i.reply({
					embed: new Eris.Embed()
						.setTitle(`Channel: ${channel.name}`)
						.setColor('#00ffcc')
						.setDescription(
							`Created at:  ${new Date(channel.createdAt).toLocaleString('vi-VN', {
								timeZone: 'Asia/Ho_Chi_Minh',
							})}\nNsfw: ${channel.nsfw}`,
						),
				});
			else
				await i.createFollowup({
					embeds: [
						new Eris.Embed()
							.setTitle(`Channel: ${channel.name}`)
							.setColor('#00ffcc')
							.setDescription(
								`Created at:  ${new Date(channel.createdAt).toLocaleString('vi-VN', {
									timeZone: 'Asia/Ho_Chi_Minh',
								})}\nNsfw: ${channel.nsfw}`,
							),
					],
				});
		} else if (
			await opt.mod.bot
				.client
				.getMessage(i.channel.id, id)
				.catch(() => false)
		) {
			const get = await opt.mod.bot.client.getMessage(i.channel.id, id);
			if (i instanceof Eris.Message)
				await i.reply({
					embeds: [
						new Eris.Embed()
							.setColor('#ffffff')
							.setAuthor('jump to message', get.jumpLink)
							.setTitle(`Message by ${get.author.tag()}`)
							.setDescription(get.content),
						...get.embeds,
					],
				});
			else
				i.createFollowup({
					embeds: [
						new Eris.Embed()
							.setColor('#ffffff')
							.setAuthor('jump to message', get.jumpLink)
							.setTitle(`Message by ${get.author.tag()}`)
							.setDescription(get.content),
						...get.embeds,
					],
				});
		} else {
			const m: any = await (
				await fetch(`https://discord.com/api/v9/users/${id}`, {
					method: 'GET',
					headers: {
						authorization: process.env.MINEVN_ANTIPIG_TOKEN,
						'user-agent':
							'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
					},
				})
			).json();

			if (i instanceof Eris.Message)
				await i.reply({
					embed: new Eris.Embed()
						.setTitle(`${m.username}#${m.discriminator}`)
						.setDescription(
							`Creation date: \n${new Date(
								Number((BigInt(id) >> BigInt(22)) + BigInt(1_420_070_400_000)),
							).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
						)
						.setColor(m.accent_color?.toString(16) || opt.mod.bot.color)
						.setImage(`https://cdn.discordapp.com/avatars/${id}/${m.avatar}.png?size=1024`),
				});
			else
				await i.createFollowup({
					embeds: [
						new Eris.Embed()
							.setTitle(`${m.username}#${m.discriminator}`)
							.setDescription(
								`Creation date: \n${new Date(
									Number((BigInt(id) >> BigInt(22)) + BigInt(1_420_070_400_000)),
								).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
							)
							.setColor(m.accent_color?.toString(16) || opt.mod.bot.color)
							.setImage(`https://cdn.discordapp.com/avatars/${id}/${m.avatar}.png?size=1024`),
					],
				});
		}
	}
}
