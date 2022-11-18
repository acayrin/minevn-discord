import Eris from 'eris';
import fetch from 'node-fetch';

import Yujin from '../../../../core/yujin';
import { SRA_state } from '../ImageBackendCheck';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Wasted',
			group: ['Fun', 'Image'],
			description: 'Wasted, GTA V style',
			commands: [
				{
					name: 'wasted',
					description: 'Wasted, GTA V style',
					type: 'message',
					usage: '%prefix%%command% [user]',
					process: async (message, opt) => {
						if (!opt.command || !SRA_state) return;

						const target =
							opt.args.length > 0 ? message.guild().getUser(opt.args.join('')) : message.author;
						return message.reply(
							{
								embed: new Eris.Embed()
									.setTitle(`${target.tag()} has been wasted`)
									.setImage(
										`https://some-random-api.ml/canvas/wasted?avatar=${target.getAvatar('png')}`,
									),
							},
							{
								name: 'pic.png',
								file: await (
									await fetch(
										`https://some-random-api.ml/canvas/wasted?avatar=${target.getAvatar('png')}`,
									)
								).buffer(),
							},
						);
					},
				},
				{
					name: 'wasted',
					description: 'Wasted, GTA V style',
					type: 'slash',
					options: [
						{
							name: 'user',
							description: 'Target user',
							type: 3,
						},
					],
					process: async (i, o) => {
						if (!SRA_state) return;

						const target =
							i.guild().getUser((o.args.at(0) as Eris.InteractionDataOptionWithValue)?.value as string) ||
							i.member ||
							i.user;
						return i.createFollowup(
							{
								embeds: [new Eris.Embed().setTitle(`${target.tag()} has been wasted`)],
							},
							{
								name: 'pic.png',
								file: await (
									await fetch(
										`https://some-random-api.ml/canvas/wasted?avatar=${target.getAvatar('png')}`,
									)
								).buffer(),
							},
						);
					},
				},
			],
		});
	}
}
