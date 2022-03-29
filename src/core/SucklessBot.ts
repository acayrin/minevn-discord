import * as Discord from "discord.js";
import { EventEmitter } from "events";
import * as fs from "fs";
import { dirname } from "path";
import { SucklessMod } from "./interface/SucklessMod";
import { CommandManager } from "./manager/CommandManager";
import { Logger } from "./utils/Logger";
const path = dirname(require.main.filename);

/**
 * Discord SucklessBot instance, wooo weee
 *
 * @export
 * @class SucklessBot
 */
export class SucklessBot extends EventEmitter {
	/**
	 * Creates an instance of SucklessBot.
	 *
	 * @param {boolean} debug Enable debug mode
	 * @param {Discord.ClientOptions} clientOptions Client options, leave 'intents' empty, else if 'intents' are specified, they will override mods intents requirements
	 * @memberof SucklessBot
	 */
	constructor(options?: { debug?: boolean; clientOptions?: Discord.ClientOptions }) {
		super();
		this.debug = options.debug;
		this.__clientOptions = options.clientOptions;

		// debugging
		this.on("debug", (m: string) => (this.debug ? this.logger.debug(m) : undefined));
	}

	/**
	 * SucklessBot's debug mode (default off)
	 *
	 * @private
	 * @type {boolean | string}
	 * @memberof SucklessBot
	 */
	public debug: boolean | string = false;

	/**
	 * SucklessBot's Client instance, for internal uses
	 *
	 * @private
	 * @type {Discord.Client}
	 * @memberof SucklessBot
	 */
	private __client: Discord.Client;

	/**
	 * SucklessBot's Client options
	 *
	 * @private
	 * @type {Discord.ClientOptions}
	 * @memberof SucklessBot
	 */
	private __clientOptions: Discord.ClientOptions;

	/**
	 * SucklessBot's Command manager instace
	 *
	 * @type {CommandManager}
	 * @memberof SucklessBot
	 */
	public cmdMgr: CommandManager = new CommandManager();

	/**
	 * SucklessBot's Logger instance
	 *
	 * @private
	 * @memberof SucklessBot
	 */
	public logger: Logger = new Logger();

	/**
	 * SucklessBot's configuration files, including core config and mod configs
	 * You can get a config file using the "configs" variable from a SucklessBot instance
	 *
	 * filename:json_object
	 *
	 * @type {Discord.Collection<String, any>}
	 * @memberof SucklessBot
	 */
	public readonly configs: Discord.Collection<String, any> = new Discord.Collection();

	/**
	 * SucklessBot's mods collection
	 *
	 * @memberof SucklessBot
	 */
	public readonly mods: SucklessMod[] = [];

	/**
	 * Get the SucklessBot's client
	 *
	 * @memberof SucklessBot
	 */
	public readonly cli = () => this.__client;

	/**
	 * SucklessBot's startup phase
	 *
	 * @private
	 * @memberof SucklessBot
	 */
	private __init = () => {
		this.logger.log(`===================== Suckless Bot =====================`);
		this.logger.log(
			`Platform ${process.platform} ${process.arch} - Node ${process.version.match(/^v(\d+\.\d+)/)[1]}`
		);

		// load configurations
		fs.readdirSync(`${path}/../config`).forEach((name) => {
			// ignore any that isn't json
			if (!name.endsWith(".json")) return;

			// configuration file
			const obj = JSON.parse(fs.readFileSync(`${path}/../config/${name}`, "utf-8"));

			// set configuration file to map
			this.configs.set(name, obj);

			// logger
			this.logger.log(`[CONFIGURATION] Loaded config file "${name}"`);
		});

		// bot's intents
		let intents: any = [];

		// load mods
		fs.readdirSync(`${path}/mods`).forEach((item) => {
			// ignore any that isn't javascript
			if (!item.endsWith(".js")) return;

			// temp to load any mods
			let mod = undefined;
			try {
				mod = new (require(`${path}/mods/${item}`).default)();
			} catch (e) {
				this.logger.error(`[LOADER] Failed to load mod "${item}"\n${e}`);
				return;
			}
			//if (!mod.command || mod.command.length === 0)
			//	return this.logger.warn(`File mods/${item} is not a valid mod`);

			// ignore disabled
			if (mod.disabled) return;

			// add required intents
			mod.intents.forEach((intent: number) => {
				if (!intents.includes(intent)) intents.push(intent);
			});

			// add aliases first, then commands
			// to prevent aliases overlapping base commands
			this.cmdMgr.register(mod);
			this.mods.push(mod);

			// mod's init phase (if any)
			if (mod.onInit)
				try {
					mod.onInit(this);
				} catch (e) {
					this.logger.error(`[${mod.name}] ${e}\n${e.stack}`);
				}

			// logger
			this.logger.log(`[LOADER] Loaded mod: ${mod.name} (${item})`);
			if (mod.aliases) this.logger.log(`- ${mod.name} registered Aliases: ${mod.aliases?.toString()}`);
			this.logger.log(`- ${mod.name} registered Commands: ${mod.command?.toString()}`);
			this.logger.log(`- ${mod.name} requested Intents: ${mod.intents}`);
		});

		// if bot is configured with intents, use those instead
		if (this.__clientOptions.intents.toString() !== "") intents = this.__clientOptions.intents;

		this.logger.log(`Requested Intents: ${intents}`);
		this.logger.log(
			`Allowed Intents: ${intents} ${
				this.__clientOptions.intents.toString() !== "" ? `(as in SucklessBot options)` : `(from mods)`
			}`
		);
		this.__client = new Discord.Client(Object.assign({}, this.__clientOptions, { intents: intents }));

		// re-order mods based on priorty
		this.mods.sort((m1, m2) => {
			return m2.priority - m1.priority;
		});
		this.logger.log("Mods priority (execution order):");
		this.mods.forEach((m) => this.logger.log(`[${m.priority}] ${m.name}`));
	};

	/**
	 * Start the SucklessBot instance
	 *
	 * @memberof SucklessBot
	 */
	public start() {
		this.__init();
		this.__client.login(this.configs.get("core.json")["token"]);
		this.__client.on("ready", this.__onConnect.bind(this));
		this.__client.on("messageCreate", this.__onMessage.bind(this));
		this.__client.on("messageDelete", this.__onDelete.bind(this));
		this.__client.on("messageUpdate", this.__onUpdate.bind(this));
		if (this.debug === "full") this.__client.on("debug", (e) => this.logger.debug(e));
	}

	/**
	 * Triggers when SucklessBot successfully connects to Discord
	 *
	 * @private
	 * @memberof SucklessBot
	 */
	private __onConnect = async () => {
		this.logger.log(`SucklessBot connected as ${this.__client.user.tag}`);
	};

	/**
	 * Triggers when SucklessBot receives a message
	 *
	 * @private
	 * @param {Discord.Message} message Chat message
	 * @memberof SucklessBot
	 */
	private __onMessage = async (message: Discord.Message) => {
		const msg = message.content.replace(this.configs.get("core.json")["prefix"], "").trim();
		const arg = msg.split(/ +/);
		const cmd = arg.shift().toLocaleLowerCase(); // command

		// if doesn't start with prefix
		// or
		// if command not found, process it as a normal message
		if (message.content.startsWith(this.configs.get("core.json")["prefix"]) && this.cmdMgr.getMod(cmd)) {
			const mod = this.cmdMgr.getMod(cmd);
			if (mod.onMsgCreate)
				mod.onMsgCreate(message, arg, this).catch((e) => this.logger.error(`[${mod.name}] ${e}\n${e.stack}`));
		} else {
			let i = -1;
			while (++i < this.mods.length) {
				if (this.mods[i].onMsgCreate) {
					// get promise reponse
					const x = await this.mods[i]
						.onMsgCreate(message, undefined, this)
						.catch((e) => this.logger.error(`[${this.mods[i].name}] ${e}\n${e.stack}`));
					// if promise response is valid and command is single, break the loop
					if (x && this.mods[i].single) break;
				}
			}
		}
	};

	/**
	 * Triggers when SucklessBot detects a deleted message
	 *
	 * @private
	 * @param {Discord.Message} message
	 * @memberof SucklessBot
	 */
	private __onDelete = async (message: Discord.Message) => {
		let i = -1;
		while (++i < this.mods.length) {
			if (this.mods[i].onMsgDelete) {
				// get promise reponse
				const x = await this.mods[i]
					.onMsgDelete(message, undefined, this)
					.catch((e) => this.logger.error(`[${this.mods[i].name}] ${e}\n${e.stack}`));
				// if promise response is valid and command is single, break the loop
				if (x && this.mods[i].single) break;
			}
		}
	};

	/**
	 * Triggers when SucklessBot detects a deleted message
	 *
	 * @private
	 * @param {Discord.Message} old message
	 * @param {Discord.Message} new message
	 * @memberof SucklessBot
	 */
	private __onUpdate = async (oldMessage: Discord.Message, newMessage: Discord.Message) => {
		let i = -1;
		while (++i < this.mods.length) {
			if (this.mods[i].onMsgUpdate) {
				// get promise reponse
				const x = await this.mods[i]
					.onMsgUpdate(oldMessage, newMessage, this)
					.catch((e) => this.logger.error(`[${this.mods[i].name}] ${e}\n${e.stack}`));
				// if promise response is valid and command is single, break the loop
				if (x && this.mods[i].single) break;
			}
		}
	};
}
