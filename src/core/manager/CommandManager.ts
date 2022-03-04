import { SucklessMod } from "../interface/SucklessMod";
import { BaseManager } from "./BaseManager";

/**
 * A Command manager
 *
 * @class CommandManager
 */
export class CommandManager extends BaseManager {
	/**
	 * Store relations between commands/aliases and mods
	 *
	 * @private
	 * @type {Map<string, SucklessMod>}
	 * @memberof CommandManager
	 */
	private __links: Map<string, SucklessMod> = new Map<string, SucklessMod>();

	/**
	 * Store commands from all mods
	 *
	 * @type {string[]}
	 * @memberof CommandManager
	 */
	public commands: string[] = [];

	/**
	 * Store aliases from all mods
	 *
	 * @type {string[]}
	 * @memberof CommandManager
	 */
	public aliases: string[] = [];

	/**
	 * Add a mod's relations, commands and aliases
	 *
	 * @param {SucklessMod} mod The mod to add
	 * @memberof CommandManager
	 */
	public register(mod: SucklessMod) {
		// get commands
		if (Array.isArray(mod.command)) {
			mod.command.forEach((cmd) => {
				this.__links.set(cmd, mod);
				this.commands.push(cmd);
			});
		} else {
			this.__links.set(mod.command, mod);
			this.commands.push(mod.command);
		}

		// get aliases
		if (Array.isArray(mod.aliases)) {
			mod.aliases.forEach((cmd) => {
				this.__links.set(cmd, mod);
				this.aliases.push(cmd);
			});
		} else {
			this.__links.set(mod.aliases, mod);
			this.aliases.push(mod.aliases);
		}
	}

	/**
	 * Get the mod based on given command (if any)
	 *
	 * @param {string} command The command to check
	 * @return {*}  {SucklessMod}
	 * @memberof CommandManager
	 */
	public getMod(command: string): SucklessMod {
		return this.__links.get(command);
	}

	/**
	 * Get all commands from a mod
	 *
	 * @param {SucklessMod} mod The mod to check
	 * @return {*}  {string[]}
	 * @memberof CommandManager
	 */
	public getCommands(mod: SucklessMod): string[] {
		return [].concat(mod.command);
	}

	/**
	 * Get all alises from a mod
	 *
	 * @param {SucklessMod} mod The mod to check
	 * @return {*}  {string[]}
	 * @memberof CommandManager
	 */
	public getAliases(mod: SucklessMod): string[] {
		return [].concat(mod.aliases);
	}
}
