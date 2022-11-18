import Eris from 'eris';
import fetch from 'node-fetch';

import Yujin from '../../../../core/yujin';
import { SRA_state } from '../ImageBackendCheck';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Jail',
			group: ['Fun', 'Image'],
			description: 'Jail someone',
			commands: [
				{
					name: 'jail',
					description: 'Jail someone',
					type: 'message',
					usage: '%prefix%%command% [user]',
					process: async (message, opt) => {
						if (!opt.command || !SRA_state) return;

						const target =
							opt.args.length > 0 ? message.guild().getUser(opt.args.join('')) : message.author;
						return message.reply(
							{
								embed: new Eris.Embed()
									.setTitle(`${target.tag()} has been jailed`)
									.setImage(
										`https://some-random-api.ml/canvas/jail?avatar=${target.getAvatar('png')}`,
									),
							},
							{
								name: 'pic.png',
								file: await (
									await fetch(
										`https://some-random-api.ml/canvas/jail?avatar=${target.getAvatar('png')}`,
									)
								).buffer(),
							},
						);
					},
				},
				{
					name: 'jail',
					description: 'Jail someone',
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
								embeds: [new Eris.Embed().setTitle(`${target.tag()} has been jailed`)],
							},
							{
								name: 'pic.png',
								file: await (
									await fetch(
										`https://some-random-api.ml/canvas/jail?avatar=${target.getAvatar('png')}`,
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
