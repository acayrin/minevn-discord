/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { basename, dirname } from 'path';
import { Writer } from './steno';

/**
 * A Datastore object
 *
 * @export
 * @class BaseDatastore
 * @typedef {BaseDatastore}
 */
export class BaseDatastore {
	/**
	 * Path to local file
	 *
	 * @type {string}
	 */
	#file: string;
	/**
	 * Path to backup folder
	 *
	 * @type {string}
	 */
	#backup_dest: string;
	/**
	 * Steno writer instance to write files
	 *
	 * @type {Writer}
	 */
	#writer: Writer;
	/**
	 * Data of this instance
	 *
	 * @type {*}
	 */
	#data: any = {
		__GLOBAL__: {},
	};
	/**
	 * Encode for saving files
	 *
	 * @type {BufferEncoding}
	 */
	#encoding: BufferEncoding;

	/**
	 * Creates an instance of BaseDatastore.
	 *
	 * @constructor
	 * @param {string} file
	 * @param {?{
				autosave_interval?: number;
				backup_interval?: number;
				backup_maxcount?: number;
				encoding?: BufferEncoding;
			}} [opt]
	 */
	constructor(
		file: string,
		opt?: {
			autosave_interval?: number;
			backup_interval?: number;
			backup_maxcount?: number;
			encoding?: BufferEncoding;
		},
	) {
		// bind path
		this.#file = file;
		this.#backup_dest = `${file}_backups`;
		this.#writer = new Writer(file);
		this.#encoding = opt?.encoding || 'utf-8';

		// init
		if (!fs.existsSync(file)) {
			fs.mkdirSync(dirname(file), { recursive: true });
			fs.writeFileSync(file, JSON.stringify(this.#data));
			this.save();
		}
		if (!fs.existsSync(this.#backup_dest)) {
			fs.mkdirSync(this.#backup_dest, { recursive: true });
		}

		// attempt to parse and bind data
		try {
			this.#data = JSON.parse(Buffer.from(fs.readFileSync(file, 'utf-8'), this.#encoding).toString());
		} catch (e) {
			console.log(`An error occured while reading data file: ${file}`);
			console.error(e);
			process.abort();
		}

		// autosave every 300 seconds (old)
		setInterval(() => this.save(), opt?.autosave_interval || 300 * 1e3);

		// auto backup every hour
		setInterval(() => {
			const existing_backups: string[] = [];
			fs.readdirSync(this.#backup_dest).forEach((item) => {
				if (item !== '.' && item !== '..') {
					existing_backups.push(item);
				}
			});
			if (existing_backups.length >= (opt?.backup_maxcount || 20))
				fs.rmSync(`${this.#backup_dest}/${existing_backups.at(0)}`);

			const date = new Date();
			const backup_name = `${basename(
				this.#backup_dest,
			)}_${date.getDate()}-${date.getMonth()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.backup`;

			new Writer(`${this.#backup_dest}/${backup_name}`)
				.write(Buffer.from(JSON.stringify(this.#data)).toString(this.#encoding))
				//.then(() => console.log(`[Datastore - ${this.#file}] Saved new backup ${backup_name}`))
				.catch((e: Error) =>
					console.error(`[Datastore - ${this.#file}] Error saving file: ${e.message}\n${e.stack}`),
				);
		}, (opt?.backup_interval || 1_800) * 1e3);

		// watch for changes, update local data if so
		fs.watchFile(this.#file, () => {
			fs.readFile(
				file,
				{
					encoding: 'utf-8',
				},
				(err, data) => {
					if (!err) this.#data = JSON.parse(Buffer.from(data, this.#encoding).toString());
				},
			);
		});
	}

	/**
	 * Add a new group to this instance
	 *
	 * @async
	 * @param {string} name
	 * @returns {Promise<BaseDatastore>}
	 */
	async addGroup(name: string): Promise<BaseDatastore> {
		if (!this.#data[name]) {
			this.#data[name] = {};
		}

		return await this.save();
	}

	/**
	 * Remove a group and all of its data in this instance
	 *
	 * @async
	 * @param {string} name
	 * @returns {Promise<BaseDatastore>}
	 */
	async removeGroup(name: string): Promise<BaseDatastore> {
		delete this.#data[name];

		return await this.save();
	}

	/**
	 * Insert new data to this instance, optionally in a group
	 *
	 * @async
	 * @param {({ key: string; value: any } | { key: string; value: any }[])} opt
	 * @param {?string} [group]
	 * @returns {Promise<BaseDatastore>}
	 */
	async set(
		opt: { key: string; value: any } | { key: string; value: any }[],
		group?: string,
	): Promise<BaseDatastore> {
		if (opt instanceof Array) {
			opt.forEach((o) => {
				// create group if not found
				if (group && !this.#data[group]) this.#data[group] = {};

				this.#data[group || '__GLOBAL__'][o.key] = o.value;
			});
		} else {
			// same as above
			if (group && !this.#data[group]) this.#data[group] = {};

			this.#data[group || '__GLOBAL__'][opt.key] = opt.value;
		}

		return await this.save();
	}

	/**
	 * Remove data from this instance, optionally in a group
	 *
	 * @async
	 * @param {(string | string[])} key
	 * @param {?string} [group]
	 * @returns {Promise<BaseDatastore>}
	 */
	async remove(key: string | string[], group?: string): Promise<BaseDatastore> {
		if (key instanceof Array) {
			key.forEach((k) => {
				delete this.#data[group || '__GLOBAL__'][k];
			});
		} else {
			delete this.#data[group || '__GLOBAL__'][key];
		}

		return await this.save();
	}

	/**
	 * Get data from this instance, optionally in a group
	 *
	 * @param {string} key
	 * @param {?string} [group]
	 * @returns {*}
	 */
	get(key: string, group?: string): any {
		return group && !this.#data[group] ? undefined : this.#data[group || '__GLOBAL__'][key];
	}

	/**
	 * List data from this instance, optionally in a group
	 *
	 * @param {?string} [group]
	 * @returns {*}
	 */
	list(group?: string): any {
		if (group) {
			if (!this.#data[group]) this.#data[group] = {};
			return Object.entries(this.#data[group]);
		}

		const o: any = {};
		Object.keys(this.#data).forEach((k) => {
			o[k] = Object.entries(this.#data[k]);
		});
		return o;
	}

	/**
	 * Save data to file, optionally define how many attempts to retry if fail
	 *
	 * @async
	 * @param {?number} [count]
	 * @returns {Promise<BaseDatastore>}
	 */
	async save(count?: number): Promise<BaseDatastore> {
		if (count > 20) {
			console.error(`[Datastore - ${this.#file}] Unable to save file after 20 attempts`);
			return this;
		}
		try {
			await this.#writer.write(Buffer.from(JSON.stringify(this.#data)).toString(this.#encoding));
		} catch (e) {
			await this.save((count || 0) + 1);
		}

		return this;
	}
}
