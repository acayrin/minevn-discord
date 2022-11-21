import Eris from 'eris';
import { AnimeSearchModel, MangaSearchModel, search } from 'mal-scraper';

import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'AniSearch',
			group: 'Weaboo',
			description: 'Search information of an anime or manga',
			icon: 'https://cdn.discordapp.com/emojis/759795518595137537.gif?size=128',
			commands: [
				{
					name: 'ani',
					description: 'Search information of an anime or manga',
					usage: '%prefix%%command% <anime/manga[:index]> <search>',
					type: 'message',
					process: (msg, opt) => {
						if (opt.args.length < 1) return this.printInvalidUsage(msg, opt.command, opt.mod.bot);
						this.#process(msg, opt);
					},
				},
				{
					name: 'anime',
					description: 'Search information of an anime or manga',
					type: 'slash',
					options: [
						{
							name: 'type',
							description: 'Search type as anime or manga',
							type: 3,
							required: true,
							choices: [
								{
									name: 'Anime',
									value: 'anime',
								},
								{
									name: 'Manga',
									value: 'manga',
								},
							],
						},
						{
							name: 'query',
							description: 'Name of the anime or manga',
							type: 3,
							required: true,
						},
						{
							name: 'index',
							description: 'Index to start searching from',
							type: 4,
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
		const o: {
			message: Eris.Message;
			type: string;
			index: number;
			term: string;
			results: (AnimeSearchModel | MangaSearchModel)[];
		} = {
			message: i instanceof Eris.Message ? await i.reply('Fetching...') : await i.createFollowup('Fetching...'),
			type: opt.args.every((o) => typeof o === 'string')
				? (opt.args as string[]).at(0).toLowerCase().split(':').at(0) || 'anime'
				: (opt.args as any).find((o: Eris.InteractionDataOptions) => o.name === 'type')?.value || 'anime',
			index: opt.args.every((o) => typeof o === 'string')
				? (opt.args as string[]).at(0).toLowerCase().split(':').at(1) || 0
				: (opt.args as any).find((o: Eris.InteractionDataOptions) => o.name === 'index')?.value || 0,
			term: opt.args.every((o) => typeof o === 'string')
				? (opt.args as string[]).at(1)
				: (opt.args as any).find((o: Eris.InteractionDataOptions) => o.name === 'query').value,
			results: [],
		};

		if (o.type === 'manga' || o.type === 'anime') opt.args.shift();
		if (!Number.isNaN(Number(o.index))) o.index = Number(o.index) - 1 < 0 ? 0 : Number(o.index) - 1;
		else o.index = 0;

		o.results = await search.search(o.type[0] === 'manga' ? 'manga' : 'anime', { term: o.term });

		await (async function send() {
			o.message = await o.message.edit({
				content: '',
				embeds: [buildResults({ index: o.index, results: o.results }), buildInfo(o.results.at(o.index))],
				components: new Eris.InteractionBuilder()
					.addButton({
						label: 'Previous',
						custom_id: 'ani_previous',
					})
					.addButton({
						label: 'Next',
						custom_id: 'ani_next',
					})
					.addButton({
						label: 'End',
						custom_id: 'ani_end',
						style: 4,
					})
					.toComponent(),
			});
			o.message
				.interactionHandler({
					filter: (e) => e.member?.id === i.member.id,
					maxMatches: 1,
					time: 30_000,
				})
				.on('interaction', async (e: Eris.ComponentInteraction) => {
					// cancel
					if (e.data.custom_id === 'ani_end') {
						return o.message.edit({
							embed: buildInfo(o.results.at(o.index)),
							components: [],
						});
					}

					// pagination
					if (e.data.custom_id === 'ani_next') {
						o.index = o.index + 1 >= o.results.length ? o.results.length - 1 : o.index + 1;
					} else if (e.data.custom_id === 'ani_previous') {
						o.index = o.index - 1 < 0 ? 0 : o.index - 1;
					}
					await e.acknowledge();
					await send();
				})
				.on('end', () => {
					return o.message.edit({
						embed: buildInfo(o.results.at(o.index)),
						components: [],
					});
				});
		})();
	}
}

// search results
function buildResults(o: { index: number; results: (AnimeSearchModel | MangaSearchModel)[] }) {
	const _desc: string[] = [];
	let i = Math.floor(o.index / 11) * 10;
	const max = i + 10 < o.results.length ? i + 10 : o.results.length;
	while (i < max) {
		_desc.push(`${i === o.index ? '**' : ''}${i + 1}. ${o.results.at(i).title}${i === o.index ? '**' : ''}`);
		i += 1;
	}

	return new Eris.Embed().setColor('#aeb420').setTitle('Search results').setDescription(_desc.join('\n'));
}

// product info
function buildInfo(res: AnimeSearchModel | MangaSearchModel) {
	const embed = new Eris.Embed()
		.setColor('#aeb420')
		.setAuthor(res.title, res.url)
		.setThumbnail(res.thumbnail)
		.addField('Score', `**${res.score}**`, true);

	if ((res as AnimeSearchModel).nbEps) {
		embed.addField('Episodes', `**${(res as AnimeSearchModel).nbEps}**`, true);
	} else {
		embed.addField(
			'Chap/Vols',
			`**${(res as MangaSearchModel).nbChapters} (${(res as MangaSearchModel).vols} vols)**`,
			true,
		);
	}

	embed.addField('Date', `**${res.startDate} / ${res.endDate}**`, true);
	embed.addField('Description', res.shortDescription.replace('read more', ''));

	return embed;
}
