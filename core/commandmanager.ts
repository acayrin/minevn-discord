import { Collection } from "discord.js";
import { DSMod } from "./interface/DSMod";

/**
 * A Command manager
 *
 * @class CommandManager
 */
class CommandManager {
    /**
     * Store relations between commands/aliases and mods
     *
     * @private
     * @type {Collection<string, DSMod>}
     * @memberof CommandManager
     */
    private links   : Collection<string, DSMod> = new Collection<string, DSMod>()
    
    /**
     * Store commands from all mods
     *
     * @type {string[]}
     * @memberof CommandManager
     */
    public commands : string[] = []

    /**
     * Store aliases from all mods
     *
     * @type {string[]}
     * @memberof CommandManager
     */
    public aliases  : string[] = []

    /**
     * Add a mod's relations, commands and aliases
     *
     * @param {DSMod} mod The mod to add
     * @memberof CommandManager
     */
    public register(mod: DSMod) {
        // get commands
        if (Array.isArray(mod.command)) {
            mod.command.forEach(cmd => {
                this.links.set(cmd, mod)
                this.commands.push(cmd)
            })
        } else {
            this.links.set(mod.command, mod)
            this.commands.push(mod.command)
        }

        // get aliases
        if (Array.isArray(mod.aliases)) {
            mod.aliases.forEach(cmd => {
                this.links.set(cmd, mod)
                this.aliases.push(cmd)
            })
        } else {
            this.links.set(mod.aliases, mod)
            this.aliases.push(mod.aliases)
        }
    }

    /**
     * Get the mod based on given command (if any)
     *
     * @param {string} command The command to check
     * @return {*}  {DSMod}
     * @memberof CommandManager
     */
    public get(command: string): DSMod | null {
        if (!command)
            return null

        return this.links.get(command)
    }

    /**
     * Get all commands from a mod
     *
     * @param {DSMod} mod The mod to check
     * @return {*}  {string[]}
     * @memberof CommandManager
     */
    public getCommands(mod: DSMod): string[] {
        return [].concat(mod.command)
    }
    
    /**
     * Get all alises from a mod
     *
     * @param {DSMod} mod The mod to check
     * @return {*}  {string[]}
     * @memberof CommandManager
     */
    public getAliases(mod: DSMod): string[] {
        return [].concat(mod.aliases)
    }
}

export { CommandManager }