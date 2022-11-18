import Eris, { InteractionDataOptions } from 'eris';
import fs from 'fs';
import path from 'path';

import Yujin from '../';

class ModSlashCommand {
	name: string;
	description: string;
	defaultPermission?: boolean;
	options?: Eris.ApplicationCommandOptions[];
	type: 'slash';
	process: (
		data: Eris.CommandInteraction,
		options: { command: string; args: InteractionDataOptions[]; mod: Yujin.Mod },
	) => Promise<unknown>;
}

class ModMessageCommand {
	name: string;
	description: string;
	usage?: string;
	type: 'message';
	process: (data: Eris.Message, options: { command: string; args: string[]; mod: Yujin.Mod }) => Promise<unknown>;
}

export type ModCommand = ModMessageCommand | ModSlashCommand;

export class BaseMod {
	constructor(o: {
		name: string;
		description?: string;
		group?: string | string[];
		author?: string;
		icon?: string;
		intents?: Eris.IntentStrings[];
		priority?: number;
		disabled?: boolean;
		cooldown?: number;
		commands?: ModCommand[];
		events?: {
			onInit?: (mod: Yujin.Mod) => Promise<unknown>;
			onMsgCreate?: (msg: Eris.Message, opt: { mod: Yujin.Mod }) => Promise<unknown>;
			onMsgDelete?: (msg: Eris.Message, opt: { mod: Yujin.Mod }) => Promise<unknown>;
			onMsgUpdate?: (newMsg: Eris.Message, oldMsg: Eris.OldMessage, opt: { mod: Yujin.Mod }) => Promise<unknown>;
			onVoiceUpdate?: (
				member: Eris.Member,
				state: Eris.VoiceState,
				opt: {
					mod: Yujin.Mod;
				},
			) => Promise<unknown>;
			onVoiceJoin?: (
				member: Eris.Member,
				channel: Eris.VoiceChannel | Eris.StageChannel,
				opt: {
					mod: Yujin.Mod;
				},
			) => Promise<unknown>;
			onVoiceLeave?: (
				member: Eris.Member,
				channel: Eris.VoiceChannel | Eris.StageChannel,
				opt: {
					mod: Yujin.Mod;
				},
			) => Promise<unknown>;
			onVoiceSwitch?: (
				member: Eris.Member,
				newChannel: Eris.VoiceChannel | Eris.StageChannel,
				oldChannel: Eris.VoiceChannel | Eris.StageChannel,
				opt: {
					mod: Yujin.Mod;
				},
			) => Promise<unknown>;
			onUserChange?: (
				user: Eris.User,
				changes: {
					username: string;
					discriminator: string;
					avatar: string;
				},
				opt: {
					mod: Yujin.Mod;
				},
			) => Promise<unknown>;
		};
	}) {
		this.name = o.name;
		this.description = o.description || 'the author is too lazy to write a description';
		this.group = o.group || 'none';
		this.author = o.author || 'acayrin';
		this.events = o.events;
		this.cooldown = o.cooldown || 5;
		this.commands = o.commands || [];
		this.icon = o.icon;
		this.intents = o.intents;
		this.priority = o.priority || 1;
		this.disabled = o.disabled || false;
	}
	// ====================================== Mod variables ======================================

	/**
	 * @description Is the mod disabled and not be loaded by the bot
	 * @type {boolean}
	 */
	readonly disabled?: boolean;

	/**
	 * @description Yujin bot instance that loaded this mod
	 * @type {Yujin.Bot}
	 * @memberof BaseMod
	 */
	bot: Yujin.Bot;

	/**
	 * @description Mod name, unique
	 * @type {string}
	 */
	readonly name: string;

	/**
	 * @description Mod group
	 * @type {string | string[]}
	 */
	readonly group?: string | string[];

	/**
	 * @description Mod author, optional
	 * @type {string}
	 */
	readonly author?: string;

	/**
	 * @description Mod icon, as a URL, optional
	 * @type {string}
	 */
	readonly icon?: string;

	/**
	 * @description Mod description, optional
	 * @type {string}
	 */
	readonly description?: string;

	/**
	 * @description Mod required intents, optional - will be overwritten by global bot options
	 * @type {Eris.IntentStrings[]}
	 */
	readonly intents?: Eris.IntentStrings[];

	/**
	 * @description Mod execution priority, determines when will the mod be executed, optional
	 * @type {number}
	 */
	readonly priority?: number = 0;

	/**
	 * @description Mod cooldown, cooldown between usages, optional - default 5 seconds
	 * @type {number}
	 */
	readonly cooldown?: number = 5;

	/**
	 * @description Mod commands
	 * @type (ModCommand[])
	 */
	readonly commands?: ModCommand[] = [];

	// Mod events
	readonly events?: {
		// ====================================== Mod self ======================================
		/**
		 * @description Mod's callback function for mod initialization event
		 */
		onInit?: (mod: Yujin.Mod) => Promise<unknown>;

		// ====================================== Messages ======================================

		/**
		 * @description Mod's callback function for message create event
		 */
		onMsgCreate?: (msg: Eris.Message, opt: { mod: Yujin.Mod }) => Promise<unknown>;

		/**
		 * @description Mod's callback function for message delete event
		 */
		onMsgDelete?: (msg: Eris.Message, opt: { mod: Yujin.Mod }) => Promise<unknown>;

		/**
		 * @description Mod's callback function for message update event
		 */
		onMsgUpdate?: (newMsg: Eris.Message, oldMsg: Eris.OldMessage, opt: { mod: Yujin.Mod }) => Promise<unknown>;

		// ====================================== Voice state ======================================

		/**
		 * @description Mod's callback function for voice state update event
		 */
		onVoiceUpdate?: (
			member: Eris.Member,
			state: Eris.VoiceState,
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;

		/**
		 * @description Mod's callback function for voice channel join event
		 */
		onVoiceJoin?: (
			member: Eris.Member,
			channel: Eris.VoiceChannel | Eris.StageChannel,
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;

		/**
		 * @description Mod's callback function for voice channel leave event
		 */
		onVoiceLeave?: (
			member: Eris.Member,
			channel: Eris.VoiceChannel | Eris.StageChannel,
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;

		/**
		 * @description Mod's callback function for voice switch event
		 */
		onVoiceSwitch?: (
			member: Eris.Member,
			newChannel: Eris.VoiceChannel | Eris.StageChannel,
			oldChannel: Eris.VoiceChannel | Eris.StageChannel,
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;

		// ====================================== User change ======================================
		/**
		 * @description Mod's callback function for user changes
		 */
		onUserChange?: (
			user: Eris.User,
			changes: {
				username: string;
				discriminator: string;
				avatar: string;
			},
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;
	};

	/**
	 * @description Local config list
	 * @export
	 * @class BaseMod
	 */
	#configs: Map<string, any> = new Map();

	/**
	 * @description Local datastore list
	 * @export
	 * @class BaseMod
	 */
	#datastores: Map<string, Yujin.Datastore> = new Map();

	/**
	 * @description Assign bot instance to this mod
	 * @param {Yujin.Bot} bot
	 * @memberof BaseMod
	 */
	assign(bot: Yujin.Bot) {
		this.bot = bot;
	}

	/**
	 * @description Print invalid usage
	 * @param {Eris.Message} msg
	 * @param {Yujin.Bot} bot
	 * @returns {*}  {Promise<unknown>}
	 * @memberof BaseMod
	 */
	printInvalidUsage(msg: Eris.Message, cmd: string, bot: Yujin.Bot): Promise<unknown> {
		const command = this.commands.find((c) => c.name === cmd);

		if (command instanceof ModMessageCommand)
			return msg.reply(
				[
					`**__Usage__**: \`\`${(command.usage || '%prefix%%command%')
						.replaceAll('%prefix%', bot.prefix)
						.replaceAll('%command%', command.name)}\`\``,
					`Type \`\`${bot.prefix}help ${command.name}\`\` for more info`,
				].join('\n'),
			);
	}

	/**
	 * @description Get default config directory
	 * @returns {*}  {string}
	 * @memberof BaseMod
	 */
	getConfigDir(): string {
		if (!fs.existsSync(path.resolve(`./mods_data/${this.name}`)))
			fs.mkdirSync(path.resolve(`./mods_data/${this.name}`), { recursive: true });

		return path.resolve(`./mods_data/${this.name}`);
	}

	/**
	 * @description Get a config, if no name was given, it will use 'config' as default
	 * @param {string} [name='config']
	 * @param {boolean} [forced] force read config from disk instead of local cache
	 * @returns {*}  {Yujin.Datastore}
	 * @memberof BaseMod
	 */
	getConfig(name = 'config', forced?: boolean): any {
		if (this.#configs.has(name) && !forced) return this.#configs.get(name);

		let data = undefined;
		fs.recursiveLookup(this.getConfigDir(), (file: string) => {
			if (path.basename(file) === `${name}.json`) {
				data = JSON.parse(fs.readFileSync(file, 'utf-8'));
			}
		});

		this.#configs.set(name, data);
		return data;
	}

	/**
	 * @description Get a datastore, if no name was given, it will use 'default' as default
	 * @param {string} [name='default']
	 * @param {boolean} [forced]
	 * @returns {*}  {Yujin.Datastore}
	 * @memberof BaseMod
	 */
	getDatastore(name = 'default', forced?: boolean): Yujin.Datastore {
		if (this.#datastores.has(name) && !forced) return this.#datastores.get(name);

		const datastore = new Yujin.Datastore(`${this.getConfigDir()}/data/${name}.db`);

		this.#datastores.set(name, datastore);
		return datastore;
	}

	/**
	 * @description Generate default config, if no name was given, it will use 'config' as default
	 * @param {unknown} defaultValue
	 * @param {string} [filename]
	 * @memberof BaseMod
	 */
	generateDefaultConfig(defaultValue: unknown, filename?: string): void {
		fs.writeFileSync(
			`${this.getConfigDir()}/${filename || 'config'}.json`,
			JSON.stringify(defaultValue, undefined, 4),
			'utf-8',
		);
		this.#configs.set(filename, defaultValue);
	}
}
