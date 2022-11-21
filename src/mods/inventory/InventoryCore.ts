import Eris from 'eris';
import fs from 'fs';
import path from 'path';
import Yujin from '../../core/yujin';
import { Item } from './type/Item';

export default class InventoryCore extends Yujin.Mod {
	constructor() {
		super({
			name: 'InventoryCore',
			group: 'Inventory',
			description: 'Base inventory mod, for use with other mods',
			priority: 9999,
			events: {
				onInit: async () => {
					if (!this.getConfig()) {
						this.generateConfig({
							test: 'value',
						});
					}

					fs.recursiveList(`${this.getConfigDir()}/items`).map(async (item) => {
						if (!path.basename(item).endsWith('.json')) return;

						try {
							const get = JSON.parse(fs.readFileSync(item, 'utf8'));
							if (this.#is_Item(get)) {
								const match = this.#item_registry.find((i) => i.id === get.id);
								if (match) {
									this.bot.warn(
										`[${this.name}] Ignoring entry '${get.name}' due to having same ID as ${match.name}`,
									);
									return;
								}
								this.#item_registry.push(get as Item);

								// debug
								this.bot.info(`[${this.name}] Added '${(get as Item).name}' to registry`);
							}
						} catch (e) {
							this.bot.warn(
								`[${this.name}] Ignoring '${path.basename(item)}' due to invalid JSON structure\n${e}`,
							);
						}
					});
					// logging
					this.bot.info(`[${this.name}] Added total ${this.#item_registry.length} items to registry`);
				},
				onMsgCreate: async (msg) => {
					if (msg.webhookID || msg.author.bot) return;

					const db = this.getDatastore();
					if (!db.get(msg.author.id)) {
						db.set({
							key: msg.author.id,
							value: [],
						});
					}
				},
			},
		});
	}

	// Local item registry
	#item_registry: Item[] = [];

	// validate if object is an Item
	#is_Item(obj: unknown): obj is Item {
		return (
			(obj as Item).name !== undefined &&
			(obj as Item).description !== undefined &&
			(obj as Item).id !== undefined &&
			(obj as Item).icon !== undefined
		);
	}

	// build item display string
	buildInv(items: Item[]): 'empty' | string {
		if (items.length === 0) return 'Empty';

		const list: Map<string, { item: Item; count: number }> = new Map();
		const res: string[] = [];

		items.forEach((item) => {
			list.set(item.id, {
				item: item,
				count: list.has(item.id) ? list.get(item.id).count + 1 : 1,
			});
		});

		Array.from(list.entries()).forEach((i) => {
			res.push(`${i[1].count}x ${i[1].item.name} ${i[1].item.icon}`);
		});

		return res.join(', ');
	}

	/**
	 * @description Give a user an item
	 * @author acayrin
	 * @param {Eris.User} user user to give
	 * @param {Item} item custom item identifier
	 * @param {number} count amount to give
	 * @returns {Item[]}
	 */
	async giveItem(user: Eris.User, item: Item, count = 1): Promise<Item[]> {
		if (!this.getDatastore().get(user.id))
			this.getDatastore().set({
				key: user.id,
				value: [],
			});

		const add: Item[] = [];
		while (count-- > 0) {
			add.push(item);
		}
		await this.getDatastore().set({
			key: user.id,
			value: this.getDatastore().get(user.id).concat(add),
		});
		return this.getDatastore().get(user.id) as Item[];
	}

	/**
	 * @description Remove an item from user
	 * @author acayrin
	 * @param {Eris.User} user user to remove
	 * @param {Item} item custom item identifier
	 * @param {number} count removal count
	 * @returns {*}  {Promise<number>}
	 */
	async removeItem(user: Eris.User, item: Item, count = 1): Promise<number> {
		if (!this.getDatastore().get(user.id))
			this.getDatastore().set({
				key: user.id,
				value: [],
			});

		const items: Item[] = this.getDatastore().get(user.id);
		const match = items.filter((it) => it.id === item.id);
		if (match.length === 0) return 0;

		let removed: Item[] = [];
		for (let i = 0; i < (count > match.length ? match.length : count); i++) {
			const rr = items.splice(items.indexOf(match.at(i)), 1);
			removed = removed.concat(rr);
		}
		await this.getDatastore().set({
			key: user.id,
			value: items,
		});

		return removed.length;
	}

	/**
	 * @description Check if a user has an item
	 * @author acayrin
	 * @param {Eris.User} user user to check
	 * @param {Item} item custom item identifier
	 * @returns {*}  {boolean}
	 */
	hasItem(user: Eris.User, item: Item): boolean {
		if (!this.getDatastore().get(user.id))
			this.getDatastore().set({
				key: user.id,
				value: [],
			});

		return (this.getDatastore().get(user.id) as Item[]).includes(item);
	}

	/**
	 * @description Get item(s) of a user
	 * @param {Eris.User} user user to get
	 * @param {{ name?: string; id?: string; value?: number }} query search query
	 * @returns {*} {Item[]}
	 */
	getItem(user: Eris.User, query?: { name?: string; id?: string; value?: number }): Item[] {
		if (!this.getDatastore().get(user.id))
			this.getDatastore().set({
				key: user.id,
				value: [],
			});

		const inventory: Item[] = this.getDatastore().get(user.id);
		const items: Item[] = [];

		if (query) {
			this.findItem(query).forEach((item) => {
				items.push(item);
			});
			return items;
		} else {
			return inventory;
		}
	}

	/**
	 * @description Query an item from registry
	 * @param {{ name?: string; id?: string; value?: number }} query search query
	 * @returns {*} {Item[]}
	 */

	findItem(query: { list?: Item[]; name?: string; id?: string; data?: unknown }): Item[] {
		const items: Item[] = query.list || this.#item_registry;
		const res: Item[] = [];

		items
			.filter((item) =>
				query.id
					? item.id === query.id
					: query.name
					? item.name.toLowerCase().includes(query.name.toLowerCase())
					: query.data
					? item.data === query.data
					: false,
			)
			.map((item) => res.push(item));

		return res;
	}
}
