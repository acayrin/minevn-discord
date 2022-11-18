import Eris from 'eris';
import fetch from 'node-fetch';

import Yujin from '../../../../core/yujin';
import { SRA_state } from '../ImageBackendCheck';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Fake Youtube Comment',
			group: ['Fun', 'Image'],
			description: 'Fake a youtube comment',
			commands: [
				{
					name: 'youtube',
					description: 'Fake a youtube comment',
					type: 'message',
					usage: '%prefix%%command% [user] [comment]',
					process: async (message, opt) => {
						if (!opt.command || !SRA_state) return;

						const target = opt.args.length > 0 ? message.guild().getUser(opt.args.shift()) : message.author;
						const comment = opt.args.length > 0 ? opt.args.join(' ') : 'I am gay';

						return message.reply(
							{
								embed: new Eris.Embed().setTitle(`${target.tag()} posted a comment`),
							},
							{
								name: 'pic.png',
								file: await (
									await fetch(
										encodeURI(
											`https://some-random-api.ml/canvas/youtube-comment?comment=${comment}&username=${
												target.username
											}&avatar=${target.getAvatar('png')}`,
										),
									)
								).buffer(),
							},
						);
					},
				},
				{
					name: 'youtube',
					description: 'Fake a youtube comment',
					type: 'slash',
					options: [
						{
							name: 'user',
							description: 'Taget user',
							type: 3,
						},
						{
							name: 'comment',
							description: 'Comment to fake',
							type: 3,
						},
					],
					process: async (i, o) => {
						if (!SRA_state) return;

						const target =
							i
								.guild()
								.getUser(
									(o.args.find((z) => z.name === 'user') as Eris.InteractionDataOptionWithValue)
										?.value as string,
								) ||
							i.member ||
							i.user;
						const comment =
							((o.args.find((z) => z.name === 'comment') as Eris.InteractionDataOptionWithValue)
								?.value as string) || 'I am gay';

						return i.createFollowup(
							{
								embeds: [
									new Eris.Embed()
										.setTitle(`${target.tag()} posted a comment`)
										.setImage(
											encodeURI(
												`https://some-random-api.ml/canvas/youtube-comment?comment=${comment}&username=${
													target.username
												}&avatar=${target.getAvatar('png')}`,
											),
										),
								],
							},
							{
								name: 'pic.png',
								file: await (
									await fetch(
										encodeURI(
											`https://some-random-api.ml/canvas/youtube-comment?comment=${comment}&username=${
												target.username
											}&avatar=${target.getAvatar('png')}`,
										),
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
