import Eris from 'eris';
import Yujin from '../../../core/yujin';
import InventoryCore from '../InventoryCore';
import { Item } from '../type/Item';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'InvAdmin',
			group: 'Inventory',
			description: "Control a user's inventory",
			commands: [
				{
					name: 'invgive',
					description: 'Give a user an amount of specific item',
					type: 'message',
					usage: '%prefix%%command% <user> <item>',
					process: async (message, opt) => {
						if (
							message.author.id !== '448046610723766273' &&
							!message.member?.roles.includes('371537555734396928')
						)
							return;
						if (opt.args.length < 1) return this.printInvalidUsage(message, opt.command, opt.mod.bot);
						const data: {
							target: Eris.User;
							mod: InventoryCore;
							item: Item;
							amount: number;
						} = {
							target: message.guild().getUser(opt.args?.shift()).user,
							mod: opt.mod.bot.mods.find((mod) => mod.name === 'InventoryCore') as InventoryCore,
							item: undefined,
							amount: Number.isNaN(Number.parseInt(opt.args.at(1))) ? 1 : Number.parseInt(opt.args.at(1)),
						};
						data.item = data.mod
							.findItem({
								name: opt.args.at(0),
							})
							.shift();

						if (!data.target) return message.reply("Can't find any matching user");
						if (!data.item) return message.reply(`Can't find any matching item`);
						return message.reply({
							content: [
								`**${data.target.tag()}** was given **${data.amount}x** **${data.item.name}**`,
								data.mod.buildInv(await data.mod.giveItem(data.target, data.item, data.amount)),
							].join('\n'),
						});
					},
				},
				{
					name: 'invremove',
					description: 'Remove a user an amount of specific item',
					type: 'message',
					usage: '%prefix%%command% <user> <item>',
					process: async (message, opt) => {
						if (
							message.author.id !== '448046610723766273' &&
							!message.member?.roles.includes('371537555734396928')
						)
							return;
						if (opt.args.length < 1) return this.printInvalidUsage(message, opt.command, opt.mod.bot);
						const data: {
							target: Eris.User;
							mod: InventoryCore;
							item: Item;
							amount: number;
						} = {
							target: message.guild().getUser(opt.args?.shift()).user,
							mod: opt.mod.bot.mods.find((mod) => mod.name === 'InventoryCore') as InventoryCore,
							item: undefined,
							amount: Number.isNaN(Number.parseInt(opt.args.at(1))) ? 1 : Number.parseInt(opt.args.at(1)),
						};
						data.item = data.mod
							.findItem({
								name: opt.args.at(0),
							})
							.shift();

						if (!data.target) return message.reply("Can't find any matching user");
						if (!data.item) return message.reply(`Can't find any matching item`);
						return message.reply({
							content: [
								`Removed **${await data.mod.removeItem(data.target, data.item, data.amount)}x** ${
									data.item.name
								} from **${data.target.tag()}**`,
							].join('\n'),
						});
					},
				},
			],
		});
	}
}
