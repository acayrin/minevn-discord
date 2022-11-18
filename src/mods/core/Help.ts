import Eris from 'eris';
import fs from 'fs';
import path from 'path';
import Yujin from '../../core/yujin';

const project_stats: {
	lines: number;
	files: number;
} = {
	lines: 0,
	files: 0,
};
fs.recursiveLookup(path.resolve('./src'), (item: string) => {
	if (!item.endsWith('.ts')) return;
	project_stats.files++;
	project_stats.lines += fs.readFileSync(item, 'utf-8').split('\n').length;
});

async function getHelp(
	int: Eris.Message | Eris.CommandInteraction,
	opt: { mod: Yujin.Mod; args: Array<string | Eris.InteractionDataOptions>; command: string },
) {
	if (opt.args?.[0]) {
		if (int instanceof Eris.Message) {
			const mod = opt.mod.bot.commandManager.getMod((opt.args as string[]).join(''));
			if (mod)
				await int.reply({
					embeds: [buildHelp(mod)],
				});
		} else if (
			opt.mod.bot.commandManager.getMod(
				((opt.args as Eris.InteractionDataOptions[]).at(0) as Eris.InteractionDataOptionWithValue)
					.value as string,
			)
		) {
			await (int as Eris.CommandInteraction).createFollowup({
				embeds: [
					buildHelp(
						opt.mod.bot.commandManager.getMod(
							(opt.args.at(0) as Eris.InteractionDataOptionWithValue).value as string,
						),
					),
				],
			});
		}
		// if no commands was specified, use the default one
	} else if (opt.command) {
		const fixed_data = {
			help_embed: new Eris.Embed()
				.setColor(opt.mod.bot.color)
				.setThumbnail(opt.mod.bot.client.user.avatarURL)
				.setTitle('ｙｕｊｉｎ   ::   a discord bot abomination')
				.setDescription(
					[
						'**Dumbass**: [acayrin](https://discord.com/api/v9/users/448046610723766273/profile)',
						'**Repository**: [Github](https://github.com/acayrin/minevn-discord-bot)',
						'**Support**: Direct Message / Github Issues',
					].join('\n'),
				)
				.addField(
					`Bot statistics`,
					[
						`Servers: **${opt.mod.bot.client.guilds.size}**`,
						`Mods: **${opt.mod.bot.mods.length}**`,
						`Commands:`,
						`+ Message: **${opt.mod.bot.commandManager.commands.length}**`,
						`+ Slash: **${(await opt.mod.bot.client.getCommands()).length}**`,
						`Files: **${project_stats.files}**`,
						`Lines: **${project_stats.lines}**`,
					].join('\n'),
				)
				.addField(
					'Looking for a mod manual?',
					`Use the dropdown menu below\nor type \`\`${opt.mod.bot.prefix}help <command>\`\``,
				)
				.setFooter(
					`Art by @funamusea`,
					int instanceof Eris.Message ? int.author.avatarURL : (int.member || int.user).avatarURL,
				),
			menu: new Eris.InteractionBuilder()
				.addRow()
				.addButton({
					label: '\u200B',
					emoji: '🏠',
					custom_id: 'core_help_home',
				})
				.addButton({
					label: 'Previous',
					custom_id: 'core_help_prev',
				})
				.addButton({
					label: 'Next',
					custom_id: 'core_help_next',
				})
				.addButton({
					label: 'End',
					custom_id: 'core_help_end',
					style: 4,
				}),
		};

		// pagination
		const data: {
			page: number;
			selected: Yujin.Mod;
		} = {
			page: 0,
			selected: undefined,
		};

		// send the help page
		const msg =
			int instanceof Eris.Message
				? await int.reply({
						embeds: [fixed_data.help_embed],
						components: fixed_data.menu
							.prependSelectMenu({
								placeholder: `Select a mod`,
								custom_id: 'core_help_menu',
								min_values: 0,
								max_values: 1,
								options: buildOptions(opt.mod.bot.mods),
							})
							.toComponent(),
				  })
				: await int.createFollowup({
						embeds: [fixed_data.help_embed],
						components: fixed_data.menu
							.prependSelectMenu({
								placeholder: `Select a mod`,
								custom_id: 'core_help_menu',
								min_values: 0,
								max_values: 1,
								options: buildOptions(opt.mod.bot.mods),
							})
							.toComponent(),
				  });

		const listener = msg.interactionHandler({
			filter: (e) => e.member.id === (int instanceof Eris.Message ? int.author.id : (int.member || int.user).id),
			time: 300_000,
		});
		listener.on('interaction', async (e: Eris.ComponentInteraction) => {
			await e.acknowledge();
			if (e.data.custom_id === 'core_help_home') {
				await msg.edit({
					embed: fixed_data.help_embed,
				});
			} else if (e.data.custom_id === 'core_help_prev') {
				await msg.edit({
					components: fixed_data.menu
						.removeRow()
						.prependSelectMenu({
							placeholder: `Select a mod`,
							custom_id: 'core_help_menu',
							min_values: 0,
							max_values: 1,
							options: buildOptions(opt.mod.bot.mods, { page: data.page - 1 < 0 ? 0 : --data.page }),
						})
						.toComponent(),
				});
			} else if (e.data.custom_id === 'core_help_next') {
				await msg.edit({
					components: fixed_data.menu
						.removeRow()
						.prependSelectMenu({
							placeholder: `Select a mod`,
							custom_id: 'core_help_menu',
							min_values: 0,
							max_values: 1,
							options: buildOptions(opt.mod.bot.mods, {
								page:
									data.page + 1 > Math.floor(opt.mod.bot.mods.length / 10)
										? Math.floor(opt.mod.bot.mods.length / 10)
										: ++data.page,
							}),
						})
						.toComponent(),
				});
			} else if (e.data.custom_id === 'core_help_menu' && e.type === 3) {
				const find = (e.data as Eris.ComponentInteractionSelectMenuData).values.shift();
				const mod = opt.mod.bot.mods.filter((mod) => mod.name.includes(find)).shift();
				await msg.edit({
					embed: buildHelp(mod),
					components: fixed_data.menu
						.removeRow()
						.prependSelectMenu({
							placeholder: `Select a mod`,
							custom_id: 'core_help_menu',
							min_values: 0,
							max_values: 1,
							options: buildOptions(opt.mod.bot.mods, {
								page: data.page,
								selected: mod,
							}),
						})
						.toComponent(),
				});
			} else if (e.data.custom_id === 'core_help_end') {
				listener.stopListening(undefined);
				await msg.edit({
					components: [],
				});
			}
		});
		listener.on('end', async (_, reason: string) => {
			if (reason === 'time')
				await msg.edit({
					components: [],
				});
		});
	}
}

function buildHelp(mod: Yujin.Mod) {
	const embed = new Eris.Embed()
		.setColor(mod.bot.color)
		.setTimestamp()
		.setThumbnail(mod.icon || mod.bot.client.user.avatarURL)
		.setTitle(`${mod.name}`)
		.setDescription(`${mod.description || "*This mod doesn't have any description*"}`)
		.addField('Group', `${mod.group ? (Array.isArray(mod.group) ? mod.group.join(', ') : mod.group) : 'none'}`)
		.addField(
			'Message Commands',
			`\`\`${
				mod.commands
					?.filter((cmd) => cmd.type === 'message')
					.map((cmd) => cmd.name)
					.join(', ') || 'none'
			}\`\``,
		)
		.addField(
			'Slash Commands',
			`\`\`${
				mod.commands
					?.filter((cmd) => cmd.type === 'slash')
					.map((cmd) => cmd.name)
					.join(', ') || 'none'
			}\`\``,
		)
		.setFooter(`by ${mod.author || 'acayrin'}`);

	mod.commands?.forEach((cmd) => {
		if (cmd.type === 'message')
			embed.addField(
				`Usage: \`\`${
					cmd.usage?.replaceAll('%prefix%', mod.bot.prefix)?.replaceAll('%command%', cmd.name) ||
					`${mod.bot.prefix}${cmd.name}`
				}\`\``,
				`Description: ${cmd.description}`,
			);
	});

	return embed;
}

function buildOptions(mods: Yujin.Mod[], o?: { page?: number; selected?: Yujin.Mod }) {
	const max = 10;
	const options: {
		label: string;
		value: string;
		description?: string;
		default?: boolean;
	}[] = [];
	let i = -1;
	while (++i < max) {
		const mod = mods.at((o?.page || 0) * max + i);
		if (mod)
			options.push({
				label: `#${(o?.page || 0) * max + i + 1} ${mod.name}`,
				value: mod.name,
				default: o?.selected === mod,
			});
	}
	return options;
}
export default class extends Yujin.Mod {
	constructor() {
		const description = "Show the bot's info and command usages";

		super({
			name: 'Help',
			group: 'Core',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description,
			commands: [
				{
					name: 'help',
					description,
					type: 'message',
					usage: '%prefix%%command% [query]',
					process: (m, o) => getHelp(m, o),
				},
				{
					name: 'h',
					description,
					type: 'message',
					usage: '%prefix%%command% [query]',
					process: (m, o) => getHelp(m, o),
				},
				{
					name: 'help',
					description,
					type: 'slash',
					options: [
						{
							name: 'query',
							description: 'Name or command of the mod to search for',
							type: 3,
						},
					],
					process: (i, o) => getHelp(i, o),
				},
			],
		});
	}
}
