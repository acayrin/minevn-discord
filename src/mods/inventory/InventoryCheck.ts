import Eris from 'eris';
import Yujin from '../../core/yujin';
import InventoryCore from './InventoryCore';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Inventory Check',
			group: 'Inventory',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description: "Check a user's inventory",
			commands: [
				{
					name: 'inv',
					description: "Check a user's inventory",
					type: 'message',
					usage: '%prefix%%command% [user]',
					process: async (msg, opt) => {
						if (!opt.command) return;

						const mod = opt.mod.bot.mods.find((mod) => mod.name === 'InventoryCore') as InventoryCore;
						const target = msg.guild().getUser(opt.args.at(0))?.user || msg.author;
						return msg.reply({
							embed: new Eris.Embed()
								.setTitle(`${target.username}'s inventory`)
								.setAuthor(target.tag(), undefined, target.avatarURL)
								.setDescription(mod.buildInv(mod.getItem(target)))
								.setColor(opt.mod.bot.color),
						});
					},
				},
			],
		});
	}
}
