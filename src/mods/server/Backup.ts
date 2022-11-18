/* eslint-disable @typescript-eslint/no-explicit-any */

import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Backup',
			group: 'Server',
			author: 'acayrin',
			intents: ['guilds', 'guildEmojisAndStickers'],
			description: 'A testing mod that creates a backup of the server',
			cooldown: 0,
			commands: [
				{
					name: 'backup',
					description: 'Get a backup of the server as a JSON file',
					type: 'message',
					process: async (msg, opt) => {
						if (!msg.member?.permissions.has('manageGuild')) return;

						const B: {
							channels: {
								name: string;
								type: number;
								position: number;
								permissions: {
									id: string;
									permissions: {
										allow: string;
										deny: string;
									};
								}[];
							}[];
							roles: {
								name: string;
								color: number;
								hexcolor: string;
								position: number;
								permissions: any;
							}[];
						} = {
							channels: [],
							roles: [],
						};
						const G = opt.mod.bot.client.guilds.get(msg.guildID);
						G.channels.forEach((ch) => {
							const p: {
								id: string;
								permissions: {
									allow: bigint;
									deny: bigint;
								};
							}[] = [];
							ch.permissionOverwrites.forEach((f) => {
								p.push({
									id: f.id,
									permissions: {
										allow: f.allow,
										deny: f.deny,
									},
								});
							});

							const perms: { id: string; permissions: { allow: string; deny: string } }[] = [];
							p.forEach((pp) =>
								perms.push({
									id: pp.id,
									permissions: {
										allow: pp.permissions.allow.toString(),
										deny: pp.permissions.deny.toString(),
									},
								}),
							);
							B.channels.push({
								name: ch.name,
								type: ch.type,
								position: ch.position,
								permissions: perms,
							});
						});
						G.roles.forEach((role) => {
							B.roles.push({
								name: role.name,
								color: role.color,
								hexcolor: role.color.toString(16),
								position: role.position,
								permissions: role.permissions.json,
							});
						});

						// fs.writeFileSync("/home/yujin/Downloads/test.json", JSON.stringify(B), "utf-8");
						msg.reply(new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), {
							name: `backup_${msg.guildID}_${Date.now()}.json`,
							file: Buffer.from(JSON.stringify(B, null, 4), 'utf-8'),
						});
					},
				},
			],
		});
	}
}
