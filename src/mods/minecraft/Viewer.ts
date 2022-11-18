/*
import { createCanvas } from 'canvas';
import Eris from 'eris';
import { createBot } from 'mineflayer';
import three from 'three';
import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Minecraft Server World Viewer',
			group: 'Minecraft',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			commands: ['mcviewer', 'mcv'],
			description: 'View a minecraft server world',
			cooldown: 30,
			usage: '%prefix%%command% [ip] [port]',
			events: {
				onInteraction: async (i, o) => {
					const { Viewer, WorldView, getBufferFromStream } = require('prismarine-viewer');

					const canvas = createCanvas(1024, 480);
					const renderer = new three.WebGLRenderer({});
					const bot = createBot({
						username: 'Yujin',
						host:
							((o.args.find((z) => z.name === 'ip') as Eris.InteractionDataOptionWithValue)
								?.value as string) || 'localhost',
						port:
							Number(
								(o.args.find((z) => z.name === 'port') as Eris.InteractionDataOptionWithValue)
									?.value as string,
							) || 25565,
					});

					const viewer = new Viewer();
					const worldView = new WorldView(bot.world, 32, bot.entity.position);
				},
			},
		});
	}
}
*/
