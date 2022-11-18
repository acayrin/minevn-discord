import Yujin from '..';

/**
 * Temporary key-value in memory database (why did it overthink it, its just a Map object)
 *
 * @export
 * @class TempDatabase
 * @typedef {TempDatabase}
 * @template T = unknown
 */
export class TempDatabase<T = unknown> {
	/**
	 * List of databases
	 *
	 * @type {Map<string, { data: T; owner: Yujin.Mod; opt?: { public?: boolean; secret?: string } }>}
	 */
	#dbs: Map<string, { data: T; owner: Yujin.Mod; opt?: { public?: boolean; secret?: string } }> = new Map();

	/**
	 * Create a new database with input data
	 *
	 * @param {string} name name of the database
	 * @param {Yujin.Mod} owner owner mod of this database
	 * @param {T} data data to input
	 * @param {?{ public?: boolean; secret?: string }} [opt] optionals
	 * @returns {boolean} whether the database was created
	 */
	set(name: string, owner: Yujin.Mod, data: T, opt?: { public?: boolean; secret?: string }): boolean {
		if (this.has(name) || !owner) return false;
		const dbn = this.#dbs.has(name) ? `${name}_${owner.name.replace(/ +/g, '').toLowerCase()}` : name;

		this.#dbs.set(dbn, {
			owner,
			data,
			opt,
		});

		// debug
		//owner.bot.info(`[TempDB] ${owner.name} created new database '${name}'`);
		return true;
	}

	/**
	 * Get data from a database
	 *
	 * @param {string} name name of the database
	 * @param {Yujin.Mod} requester requesting mod
	 * @param {?string} [secret] secret token to use this database
	 * @returns {(T | undefined)} returned data
	 */
	get(name: string, requester: Yujin.Mod, secret?: string): T | undefined {
		if (!this.#dbs.has(name) || !requester) return undefined;

		const db = this.#dbs.get(name);
		let data = undefined;
		if (db.opt?.public || db.owner === requester || (db.opt?.secret && db.opt.secret === secret)) {
			data = db.data;
		}

		// debug
		//db.owner.bot.info(`[TempDB] ${requester.name} requested data from '${name}'`);
		return data;
	}

	/**
	 * Update a database with given data
	 *
	 * @param {string} name name of the database
	 * @param {Yujin.Mod} requester requesting mod
	 * @param {T} data data to input
	 * @param {?string} [secret] secret token to use this database
	 * @returns {boolean} whether the database was updated
	 */
	update(name: string, requester: Yujin.Mod, data: T, secret?: string): boolean {
		if (!this.#dbs.has(name) || !requester) return false;

		const db = this.#dbs.get(name);
		let status = false;
		if (db.opt?.public || db.owner === requester || (db.opt?.secret && db.opt.secret === secret)) {
			this.set(name, db.owner, data, db.opt);
			status = true;
		}

		// debug
		//db.owner.bot.info(`[TempDB] ${requester.name} updated data in '${name}'`);
		return status;
	}

	/**
	 * Check whether database with name exists
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name: string): boolean {
		return this.#dbs.has(name);
	}

	/**
	 * Delete a database and its data
	 *
	 * @param {string} name name of the database
	 * @param {Yujin.Mod} owner owner mod of this database
	 * @returns {boolean} whether the database was deleted
	 */
	delete(name: string, owner: Yujin.Mod): boolean {
		if (!this.has(name) || !owner) return false;

		let status = false;
		if (this.#dbs.get(name).owner === owner) {
			status = this.#dbs.delete(name);
		}

		// debug
		//owner.bot.info(`[TempDB] ${owner.name} deleted database '${name}'`);
		return status;
	}
}
