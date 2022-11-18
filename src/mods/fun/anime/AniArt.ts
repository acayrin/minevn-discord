import Eris from 'eris';
import fetch from 'node-fetch';
import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'AniArt',
			group: 'Weaboo',
			description: 'Search anime artworks from various booru sites.\nNSFW is only allowed in said channel',
			icon: 'https://c.tenor.com/uhb_2I0x7G4AAAAM/anya-forger-anya-spy-x-family-anime.gif',
			cooldown: 20,
			commands: [
				{
					name: 'bu',
					description: 'Search for artworks from various booru sites. NSFW is only allowed in said channel',
					type: 'message',
					usage: '%prefix%%command% <search_query>',
					process: (msg: Eris.Message, opt) => {
						if (opt.args.length < 1) return this.printInvalidUsage(msg, opt.command, opt.mod.bot);

						// print
						return this.#process(msg, opt);
					},
				},
				{
					name: 'booru',
					description: 'Search for artworks from various booru sites. NSFW is only allowed in said channel',
					type: 'message',
					usage: '%prefix%%command% <search_query>',
					process: (msg: Eris.Message, opt) => {
						if (opt.args.length < 1) return this.printInvalidUsage(msg, opt.command, opt.mod.bot);

						// print
						return this.#process(msg, opt);
					},
				},
				{
					name: 'booru',
					description: 'Search for artworks from various booru sites. NSFW is only allowed in said channel',
					type: 'slash',
					options: [
						{
							name: 'query',
							description: 'Image search query',
							type: 3,
							required: true,
						},
					],
					process: (i, o) => this.#process(i, o),
				},
			],
		});
	}

	async #process(
		i: Eris.Message | Eris.CommandInteraction,
		opt: { mod: Yujin.Mod; args: (string | Eris.InteractionDataOptions)[]; command: string },
	) {
		let message = i instanceof Eris.Message ? await i.reply('Fetching...') : await i.createFollowup('Fetching...');

		// send
		async function send() {
			const list = await load(
				opt.args.every((o) => typeof o === 'string')
					? opt.args.join('_')
					: ((opt.args as Eris.InteractionDataOptionWithValue[]).find((o) => o.name === 'query')
							.value as string),
				i.channel.toJSON()['nsfw'] as boolean,
			);

			if (!Array.isArray(list) || list.length < 1) {
				return message.edit({
					content: '',
					embed: new Eris.Embed()
						.setColor(opt.mod.bot.color)
						.setTitle(errors[Math.floor(Math.random() * errors.length)])
						.setDescription(`Error: ${!Array.isArray(list) ? list.error : 'Empty result'}`)
						.addField(
							'Booru Searching Cheatsheet',
							'[Click me, i swear im not a rickroll](https://danbooru.donmai.us/wiki_pages/help%3Acheatsheet)',
						),
				});
			}

			const res = list.at(Math.floor(Math.random() * list.length));
			message = await message.edit({
				content: '',
				embed: new Eris.Embed()
					.setColor(opt.mod.bot.color)
					.setImage(res.image)
					.setTitle(res.title)
					.setDescription(`[Original](${res.source}) - Rating: ${res.rating}`),
				components: new Eris.InteractionBuilder()
					.addButton({
						label: 'More',
						custom_id: 'art_more',
					})
					.addButton({
						label: 'End',
						custom_id: 'art_end',
						style: 4,
					})
					.toComponent(),
				messageReference: {
					messageID: i.id,
				},
			});
			message
				.interactionHandler({
					filter: (e) => e.member.id === i.member.id,
					maxMatches: 1,
					time: 30_000,
				})
				.on('interaction', async (e: Eris.ComponentInteraction) => {
					await e.acknowledge();
					if (e.data.custom_id === 'art_more') {
						await send();
					} else {
						await message.edit({
							components: [],
						});
					}
				})
				.on('end', () => {
					message.edit({
						components: [],
					});
				});
		}

		return send();
	}
}

const errors = [
	'Owwie, nothing was found. Try changing your search query',
	'Error: Weaboo not found',
	'VNPT is so disappointed that they cut the internet',
	'The nuts exploded',
	'Maybe take a break',
	'Let the little guy rest will ya',
	'How many have you stored',
];

async function load(args: string, nsfw = false) {
	const list: {
		title: string;
		source: string;
		image: string;
		rating: string;
	}[] = [];

	return Promise.all(
		[
			`https://${
				nsfw ? 'danbooru' : 'safebooru'
			}.donmai.us/posts.json?tags=${args}&random=true&rating=safe&limit=100`,
		].map(async (url) => {
			const data = await (await fetch(url)).json();
			if (Array.isArray(data.data?.children)) {
				await Promise.all(
					data.data.children.map(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(post: any) => {
							const json = post.data;
							if (
								!json.secure_media &&
								json.is_reddit_media_domain &&
								json.url_overridden_by_dest &&
								!json.is_gallery &&
								!list.includes(json)
							)
								list.push({
									title: json.title,
									source: `https://www.reddit.com${json.permalink}`,
									image: json.url_overridden_by_dest,
									rating: `${json.ups} / ${json.downs}`,
								});
						},
					),
				);
			} else if (Array.isArray(data)) {
				await Promise.all(
					data.map((booru) => {
						list.push({
							title: `Booru #${booru.id}`,
							source: `https://${nsfw ? 'danbooru' : 'safebooru'}.donmai.us/posts/${booru.id}`,
							image: booru.large_file_url,
							rating: `${booru.up_score} / ${booru.down_score}`,
						});
					}),
				);
			}
		}),
	)
		.then(() => {
			return list;
		})
		.catch((e: Error) => {
			return {
				error: e.message,
			};
		});
}
