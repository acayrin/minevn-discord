import Yujin from '../../yujin';
import { BaseManager } from '../base/BaseManager';

/**
 * A Command manager
 *
 * @class CommandManager
 */
export class CommandManager extends BaseManager {
	/**
	 * Store relations between commands/aliases and mods
	 *
	 * @type {Map<string, Yujin.Mod>}
	 * @memberof CommandManager
	 */
	#links: Map<string, Yujin.Mod> = new Map<string, Yujin.Mod>();

	/**
	 * Store commands from all mods
	 *
	 * @type {string[]}
	 * @memberof CommandManager
	 */
	commands: string[] = [];

	/**
	 * Store aliases from all mods
	 *
	 * @type {string[]}
	 * @memberof CommandManager
	 */
	aliases: string[] = [];

	/**
	 * Add a mod's relations, commands and aliases
	 *
	 * @param {Yujin.Mod} mod The mod to add
	 * @memberof CommandManager
	 */
	register(mod: Yujin.Mod) {
		// get commands
		if (Array.isArray(mod.commands)) {
			mod.commands.forEach((cmd) => {
				if (this.#links.get(cmd.name) && mod.name !== this.#links.get(cmd.name).name) {
					mod.bot.warn(`Command "${cmd.name}" has already been claimed by another mod`);
					mod.bot.warn(`  Requested: ${mod.name}`);
					mod.bot.warn(`  Found: ${this.#links.get(cmd.name).name}`);
				} else {
					this.#links.set(cmd.name, mod);
					this.commands.push(cmd.name);
				}
			});
		}

		// default import
		if (!mod.commands) this.#links.set(`__${mod.name}`, mod);
	}

	/**
	 * Get the mod based on given query (if any)
	 *
	 * @param {string} query The commands to check
	 * @return {Yujin.Mod | undefined}
	 * @memberof CommandManager
	 */
	getMod(query: string): Yujin.Mod | undefined {
		const mod = this.#links.get(query);

		if (mod) return mod;

		for (const [cmd, mod] of Array.from(this.#links)) {
			if (mod && (mod.name.toLowerCase() === query.toLowerCase() || cmd?.toLowerCase() === query.toLowerCase())) {
				return mod;
			}
		}

		return undefined;
	}
}
