import Eris from 'eris';

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Cats',
			group: 'Fun',
			description: 'Cats, cuz why not',
			icon: 'https://cataas.com/cat',
			commands: [
				{
					name: 'neko',
					description: 'Get some cat images',
					usage: '%prefix%%command% [asGif]',
					type: 'message',
					process: (msg, opt) =>
						msg.reply({
							embed: new Eris.Embed()
								.setTitle('Cat')
								.setImage(opt.args.at(0) ? 'https://cataas.com/cat/gif' : 'https://cataas.com/cat')
								.setColor('#ee77ee')
								.setAuthor('Squish that cat'),
						}),
				},
				{
					name: 'cat',
					description: 'Get some cat images',
					type: 'slash',
					options: [
						{
							name: 'gif',
							description: 'Get GIF images instead',
							type: 4,
							choices: [
								{
									name: 'Yes',
									value: 1,
								},
								{
									name: 'No',
									value: 2,
								},
							],
						},
					],
					process: (i, o) =>
						i.createFollowup({
							embeds: [
								new Eris.Embed()
									.setTitle('Cat')
									.setImage(
										(o.args.find((z) => z.name === 'gif') as Eris.InteractionDataOptionWithValue)
											?.value === 1
											? 'https://cataas.com/cat/gif'
											: 'https://cataas.com/cat',
									)
									.setColor('#ee77ee')
									.setAuthor('Squish that cat'),
							],
						}),
				},
			],
		});
	}
}
