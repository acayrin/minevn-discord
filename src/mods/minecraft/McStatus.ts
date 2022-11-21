import { Canvas, createCanvas, loadImage, registerFont } from 'canvas';
import Eris from 'eris';
import fs from 'fs';
import fetch from 'node-fetch';
import Yujin from '../../core/yujin';
import { getStatus } from './Status';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Minecraft Server Status',
			group: 'Minecraft',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description: 'Ping a minecraft server',
			cooldown: 5,
			commands: [
				{
					name: 'mc',
					description: 'Ping a minecraft server',
					usage: '%prefix%%command% [ip] [port]',
					type: 'message',
					process: async (msg, opt) => this.#process(msg, opt),
				},
				{
					name: 'minecraft',
					description: 'Ping a minecraft server',
					type: 'slash',
					options: [
						{
							name: 'ip',
							description: 'IP Address of the server, default to minevn.net',
							type: 3,
						},
						{
							name: 'port',
							description: 'Port of the server, default to 25565',
							type: 4,
						},
						{
							name: 'extended',
							description: 'Display extended info about the server',
							type: 3,
						},
					],
					process: (i, o) => this.#process(i, o),
				},
			],
			events: {
				onInit: async (): Promise<void> => {
					if (!this.getConfig())
						this.generateConfig({
							background: 'https://yujin-cdn.vercel.app/bg_1.jpg',
							font_family: 'Helvetica',
							font_color: '#FFFFFF',
							font_size: {
								normal: 14,
								small: 10,
								big: 17,
							},
							overlay_opacity: 0.67,
							upscale: 2,
						});

					if (!fs.existsSync(`${this.getConfigDir()}/minecraft.ttf`)) {
						const res = await fetch('https://yujin-cdn.vercel.app/Minecraftia.ttf');
						const fileStream = fs.createWriteStream(`${this.getConfigDir()}/minecraft.ttf`);
						await new Promise((resolve, reject) => {
							res.body.pipe(fileStream);
							res.body.on('error', reject);
							fileStream.on('finish', resolve);
						});
					}
				},
			},
		});
	}

	async #process(
		i: Eris.Message | Eris.CommandInteraction,
		opt: { mod: Yujin.Mod; args: (string | Eris.InteractionDataOptions)[]; command: string },
	): Promise<void> {
		let extended_cmd = false;
		if (opt.args.every((o) => typeof o === 'string'))
			for (let i = 0; i < opt.args.length; i++) {
				if ((opt.args.at(i) as string).match(/--\w+/g)) {
					extended_cmd = opt.args.splice(i, 1).shift() === '--extended';
				}
			}
		else
			extended_cmd = (opt.args as Eris.InteractionDataOptions[]).find((o) => o.name === 'extended') !== undefined;

		// use 'minevn.net' if no ip was given | use port 25565 if no other port was given
		const data: {
			config: {
				background: string;
				font_family: string;
				font_color: string;
				font_size: {
					normal: number;
					small: number;
					big: number;
				};
				overlay_opacity: number;
				upscale: number;
			};
			ip: string;
			port: number;
			description: {
				text: string;
				color?: string;
				bold?: boolean;
				obfuscated?: boolean;
				italic?: boolean;
				strikethrough?: boolean;
				underline?: boolean;
				reset?: boolean;
			}[];
			basic_description: string;
			image: string;
		} = {
			config: opt.mod.getConfig('config', true),
			ip: opt.args.every((o) => typeof o === 'string')
				? (opt.args as string[]).at(0) || 'minevn.net'
				: ((opt.args as Eris.InteractionDataOptionWithValue[]).find((o) => o.name === 'ip')?.value as string) ||
				  'minevn.net',
			port: opt.args.every((o) => typeof o === 'string')
				? Number((opt.args as string[]).at(1)) || 25_565
				: Number(
						(opt.args as Eris.InteractionDataOptionWithValue[]).find((o) => o.name === 'port')
							?.value as string,
				  ) || 25_565,
			description: [],
			basic_description: undefined,
			image: undefined,
		};

		try {
			const status = await getStatus(data.ip, data.port);

			if (typeof status.description === 'string') {
				data.basic_description = status.description.replaceAll(/§./g, '').replace(/ +/g, ' ');
			} else {
				status.description.extra.forEach((char): void => {
					if (char.text.length > 1) {
						char.text.split('').forEach((sub_char: string) => {
							data.description.push({
								text: sub_char,
								color: char.color,
								bold: char.bold,
								italic: char.italic,
								obfuscated: char.obfuscated,
								strikethrough: char.strikethrough,
								reset: char.reset,
							});
						});
					} else {
						data.description.push(char);
					}
				});
			}

			// canvas here
			registerFont(`${this.getConfigDir()}/minecraft.ttf`, { family: 'Minecraft' });
			const canvas = createCanvas(500, 80);
			const context = canvas.getContext('2d');

			// configs
			context.quality = 'bilinear';
			context.antialias = 'subpixel';
			context.patternQuality = 'bilinear';
			context.textDrawingMode = 'glyph';

			// background
			context.drawImage(
				await loadImage(
					data.config.background.startsWith('http://') || data.config.background.startsWith('https://')
						? await (await fetch(data.config.background)).buffer()
						: Buffer.from(data.config.background, 'base64'),
				),
				0,
				0,
			);

			// darken overlay
			context.fillStyle = `rgba(0, 0, 0, ${data.config.overlay_opacity || 0.67})`;
			context.fillRect(0, 0, 500, 80);

			// server favicon
			context.drawImage(
				await loadImage(Buffer.from(status.favicon.replaceAll('data:image/png;base64,', ''), 'base64')),
				8,
				8,
			);

			// description
			context.font = `${data.config.font_size.normal}px ${data.config.font_family}`;
			context.fillStyle = data.config.font_color;
			context.textAlign = 'left';

			if (typeof status.description !== 'string') {
				let x_offset = 0;
				let y_axis = 34;
				data.description.forEach((char): void => {
					if (char.text === '\n') {
						y_axis = 52;
						x_offset = 0;
					}

					// color
					context.fillStyle = char.color
						? (this.#formatting_colors as any)[char.color] || char.color
						: data.config.font_color;

					// style
					if (char.strikethrough) {
						context.fillRect(100 + x_offset, y_axis - 7, context.measureText(char.text).width, 2);
					}
					if (char.underline) {
						context.fillRect(100 + x_offset, y_axis + 1, context.measureText(char.text).width, 2);
					}
					if (char.italic) {
						context.font = [`italic`, `${data.config.font_size.normal}px`, data.config.font_family].join(
							' ',
						);
					}
					if (char.bold) {
						context.font = [`bold`, `${data.config.font_size.normal}px`, data.config.font_family].join(' ');
					}
					if (char.reset) {
						context.font = [`normal`, `${data.config.font_size.normal}px`, data.config.font_family].join(
							' ',
						);
						context.fillStyle = data.config.font_color;
					}

					// fill text
					context.fillText(char.text, 100 + x_offset, y_axis);
					x_offset += context.measureText(char.text).width;
				});
			} else {
				context.fillText(data.basic_description.split('\n').at(0), 100, 34);
				context.fillText(data.basic_description.split('\n').at(1), 100, 52);
			}

			context.font = `${data.config.font_size.small}px ${data.config.font_family}`;
			context.fillStyle = this.#formatting_colors.green;
			context.textAlign = 'right';
			context.fillText(`${status.players.online} online`, 495, 75);

			await this.#resample_single(canvas, 500 * data.config.upscale, 80 * data.config.upscale, true);

			if (extended_cmd) {
				const desc: string[] = [];
				data.description?.forEach((char) => {
					desc.push(char.text);
				});
				const samples: string[] = [];
				status.players.sample?.forEach((sample) => {
					samples.push(sample.name.replaceAll(/§./g, ''));
				});
				if (i instanceof Eris.Message)
					await i.reply(
						{
							embed: new Eris.Embed()
								.setColor(this.bot.color)
								.setTitle((data.ip === '127.0.0.1' ? 'MINEVN.NET' : data.ip).toUpperCase())
								.setDescription(data.basic_description?.replace(/§\d/g, '') || desc.join(''))
								.addField(
									'Players',
									`Online: **${status.players.online}**\nMaximum: **${status.players.max}**`,
									true,
								)
								.addField(
									'Version',
									[
										`Name: **${status.version.name}**`,
										`Readable: **${
											(this.#minecraft_protocols as any)[status.version.protocol.toString()] ||
											'Unknown'
										}**`,
										`Protocol: **${status.version.protocol}**`,
									].join('\n'),
									true,
								)
								.addField('Samples', samples.join('\n')),
						},
						{
							file: canvas.toBuffer('image/png'),
							name: 'banner.png',
						},
					);
				else
					await i.createFollowup(
						{
							embeds: [
								new Eris.Embed()
									.setColor(this.bot.color)
									.setTitle((data.ip === '127.0.0.1' ? 'MINEVN.NET' : data.ip).toUpperCase())
									.setDescription(data.basic_description?.replace(/§\d/g, '') || desc.join(''))
									.addField(
										'Players',
										`Online: **${status.players.online}**\nMaximum: **${status.players.max}**`,
										true,
									)
									.addField(
										'Version',
										[
											`Name: **${status.version.name}**`,
											`Readable: **${
												(this.#minecraft_protocols as any)[
													status.version.protocol.toString()
												] || 'Unknown'
											}**`,
											`Protocol: **${status.version.protocol}**`,
										].join('\n'),
										true,
									)
									.addField('Samples', samples.join('\n')),
							],
						},
						{
							file: canvas.toBuffer('image/png'),
							name: 'banner.png',
						},
					);
			} else
				await i.reply('\u200B', {
					file: canvas.toBuffer('image/png'),
					name: 'banner.png',
				});
		} catch (e: unknown) {
			if (i instanceof Eris.Message) await i.report(e as Error, __filename);
			else await (await i.getOriginalMessage()).report(e as Error, __filename);
		}
	}

	async #resample_single(canvas: Canvas, width: number, height: number, resize_canvas: boolean) {
		const width_source = canvas.width;
		const height_source = canvas.height;
		width = Math.round(width);
		height = Math.round(height);

		const ratio_w = width_source / width;
		const ratio_h = height_source / height;
		const ratio_w_half = Math.ceil(ratio_w / 2);
		const ratio_h_half = Math.ceil(ratio_h / 2);

		const ctx = canvas.getContext('2d');
		const img = ctx.getImageData(0, 0, width_source, height_source);
		const img2 = ctx.createImageData(width, height);
		const data = img.data;
		const data2 = img2.data;

		for (let j = 0; j < height; j++) {
			for (let i = 0; i < width; i++) {
				const x2 = (i + j * width) * 4;
				let weight = 0;
				let weights = 0;
				let weights_alpha = 0;
				let gx_r = 0;
				let gx_g = 0;
				let gx_b = 0;
				let gx_a = 0;
				const center_y = (j + 0.5) * ratio_h;
				const yy_start = Math.floor(j * ratio_h);
				const yy_stop = Math.ceil((j + 1) * ratio_h);
				for (let yy = yy_start; yy < yy_stop; yy++) {
					const dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
					const center_x = (i + 0.5) * ratio_w;
					const w0 = dy * dy; //pre-calc part of w
					const xx_start = Math.floor(i * ratio_w);
					const xx_stop = Math.ceil((i + 1) * ratio_w);
					for (let xx = xx_start; xx < xx_stop; xx++) {
						const dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
						const w = Math.sqrt(w0 + dx * dx);
						if (w >= 1) {
							//pixel too far
							continue;
						}
						//hermite filter
						weight = 2 * w * w * w - 3 * w * w + 1;
						const pos_x = 4 * (xx + yy * width_source);
						//alpha
						gx_a += weight * data[pos_x + 3];
						weights_alpha += weight;
						//colors
						if (data[pos_x + 3] < 255) weight = (weight * data[pos_x + 3]) / 250;
						gx_r += weight * data[pos_x];
						gx_g += weight * data[pos_x + 1];
						gx_b += weight * data[pos_x + 2];
						weights += weight;
					}
				}
				data2[x2] = gx_r / weights;
				data2[x2 + 1] = gx_g / weights;
				data2[x2 + 2] = gx_b / weights;
				data2[x2 + 3] = gx_a / weights_alpha;
			}
		}
		//clear and resize canvas
		if (resize_canvas === true) {
			canvas.width = width;
			canvas.height = height;
		} else {
			ctx.clearRect(0, 0, width_source, height_source);
		}

		//draw
		ctx.putImageData(img2, 0, 0);
	}

	#formatting_colors = {
		black: '#000000',
		dark_blue: '#0000AA',
		dark_green: '#00AA00',
		dark_aqua: '#00AAAA',
		dark_red: '#AA0000',
		dark_purple: '#AA00AA',
		gold: '#FFAA00',
		gray: '#AAAAAA',
		dark_gray: '#555555',
		blue: '#5555FF',
		green: '#55FF55',
		aqua: '#55FFFF',
		red: '#FF5555',
		light_purple: '#FF55FF',
		yellow: '#FFFF55',
		white: '#FFFFFF',
		minecoin_gold: '#DDD605',
	};

	#minecraft_protocols = {
		'759': '1.19',
		'758': '1.18.2',
		'757': '1.18 / 1.18.1',
		'756': '1.17.1',
		'755': '1.17',
		'754': '1.16.4 / 1.16.5',
		'753': '1.16.3',
		'751': '1.16.2',
		'736': '1.16.1',
		'735': '1.16',
		'578': '1.15.2',
		'575': '1.15.1',
		'573': '1.15',
		'498': '1.14.4',
		'490': '1.14.3',
		'485': '1.14.2',
		'480': '1.14.1',
		'477': '1.14',
		'404': '1.13.2',
		'401': '1.13.1',
		'393': '1.13',
		'340': '1.12.2',
		'338': '1.12.1',
		'335': '1.12',
		'316': '1.11.1 / 1.11.2',
		'315': '1.11',
		'210': '1.10 / 1.10.1 / 1.10.2',
		'110': '1.9.3 / 1.9.4',
		'109': '1.9.2',
		'108': '1.9.1',
		'107': '1.9',
		'47': '1.8.x',
	};
}
