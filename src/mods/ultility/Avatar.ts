import Eris from 'eris';

import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Avatar',
			group: 'Utility',
			author: 'acayrin',
			intents: ['guilds', 'guildMembers', 'guildMessages'],
			description: "Get a user's avatar",
			cooldown: 10,
			commands: [
				{
					name: 'av',
					description: "Get a user's avatar",
					usage: '%prefix%%command% [user]',
					type: 'message',
					process: async (msg, opt) => {
						const mem = opt.args.length > 0 ? msg.guild().getUser(opt.args.join(' '))?.user : msg.author;
						try {
							return await msg.reply({
								embeds: [
									new Eris.Embed()
										.setColor(mem.accentColor?.toString(16) || opt.mod.bot.color)
										.setTitle(`Avatar for ${mem.tag()}`)
										.setDescription(
											[
												`[webp](${mem.getAvatar()})`,
												'::',
												`[jpg](${mem.getAvatar('jpg')})`,
												'::',
												`[png](${mem.getAvatar('png')})`,
											].join(' '),
										)
										.setImage(`${mem.avatarURL}`),
								],
							});
						} catch (e) {
							return await msg.report(e, __filename);
						}
					},
				},
				{
					name: 'avatar',
					description: "Get a user's avatar",
					type: 'slash',
					options: [
						{
							name: 'user',
							description: 'User to get avatar from',
							type: 3,
						},
					],
					process: async (int, opt) => {
						const mem =
							int.channel.client
								.getGuild(int.guildID)
								.getUser(
									(opt.args as Eris.InteractionDataOptionWithValue[]).find((o) => o.name === 'user')
										?.value as string,
								)?.user ||
							int.member ||
							int.user;
						if (!mem) return int.createFollowup(`Found nobody with that name`);

						return int
							.createFollowup({
								embeds: [
									new Eris.Embed()
										.setColor(mem.accentColor?.toString(16) || this.bot.color)
										.setTitle(`Avatar for ${mem.tag()}`)
										.setDescription(
											[
												`[webp](${mem.getAvatar()})`,
												'::',
												`[jpg](${mem.getAvatar('jpg')})`,
												'::',
												`[png](${mem.getAvatar('png')})`,
											].join(' '),
										)
										.setImage(`${mem.avatarURL}`),
								],
							})
							.catch(async (e) => {
								await int.acknowledge();
								(await int.getOriginalMessage()).report(e, __filename);
							});
					},
				},
			],
		});
	}
}
