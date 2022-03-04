import { Intents, Message, PartialMessage } from "discord.js";
import { SucklessBot } from "../SucklessBot";

/**
 * Suckless Bot module class
 *
 * @export
 * @interface SucklessMod
 */
export abstract class SucklessMod {
	/**
	 * Creates an instance of SucklessMod.
	 * @memberof SucklessMod
	 */
	constructor(options?: {
		disabled?: boolean,
		name?: string,
		description?: string,
		usage?: string,
		author?: string,
		intents?: number[],
		command?: string | string[],
		aliases?: string | string[],
		events?: {
			onInit?: any,
			onMsgCreate?: any,
			onMsgUpdate?: any,
			onMsgDelete?: any
		}
	}) {
		this.disabled = options.disabled;
		this.name = options.name;
		this.description = options.description;
		this.usage = options.usage;
		this.author = options.author;
		this.intents = options.intents;
		this.command = options.command;
		this.aliases = options.aliases;
		this.onInit = options.events?.onInit;
		this.onMsgCreate = options.events?.onMsgCreate;
		this.onMsgUpdate = options.events?.onMsgUpdate;
		this.onMsgDelete = options.events?.onMsgDelete;
	}

	/**
	 * Whether the mod is disabled
	 *
	 * @type {boolean}
	 * @memberof SucklessMod
	 */
	public disabled?: boolean;

	/**
	 * A mod name
	 *
	 * @type {string}
	 * @memberof SucklessMod
	 */
	public name: string;

	/**
	 * Mod's author (if any)
	 *
	 * @type {string}
	 * @memberof SucklessMod
	 */
	public author?: string;

	/**
	 * Mod's required Discord intents
	 *
	 * @type {number[]}
	 * @memberof SucklessMod
	 */
	public intents: number[];

	/**
	 * Mod's base command
	 *
	 * @type {string}
	 * @memberof SucklessMod
	 */
	public command: string | string[];

	/**
	 * Mod's command aliases (if any)
	 *
	 * @type {string[]}
	 * @memberof SucklessMod
	 */
	public aliases?: string | string[];

	/**
	 * Mod's description (if any)
	 *
	 * @type {string}
	 * @memberof SucklessMod
	 */
	public description?: string;

	/**
	 * Mod's usage, shown when missing input (if any)
	 *
	 * @type {string}
	 * @memberof SucklessMod
	 */
	public usage: string;

	/**
	 * Mod's callback function during setup
	 *
	 * @memberof SucklessMod
	 */
	public onInit?: (bot: SucklessBot) => void;

	/**
	 * Mod's callback function for messageCreate event
	 *
	 * @memberof SucklessMod
	 */
	public onMsgCreate?: (msg: Message | PartialMessage, arg: string[], bot: SucklessBot) => void;

	/**
	 * Mod's callback function for messageDelete event
	 *
	 * @memberof SucklessMod
	 */
	public onMsgDelete?: (msg: Message | PartialMessage, arg: string[], bot: SucklessBot)=> void;

	/**
	 * Mod's callback function for messageUpdate event
	 *
	 * @memberof SucklessMod
	 */
	public onMsgUpdate?: (oldMsg: Message | PartialMessage, newMsg: Message | PartialMessage, bot: SucklessBot)=> void;
}
