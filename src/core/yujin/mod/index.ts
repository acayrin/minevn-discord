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

	/**
	 * Whether the mod is disabled and should be ignored during boot time
	 */
	readonly disabled?: boolean;

	/**
	 * Yujin Bot instance that run this mod
	 */
	bot: Yujin.Bot;

	/**
	 * Mod display name
	 */
	readonly name: string;

	/**
	 * Mod group(s), if any
	 */
	readonly group?: string | string[];

	/**
	 * Mod author
	 */
	readonly author?: string;

	/**
	 * Mod icon, as an image URL
	 */
	readonly icon?: string;

	/**
	 * Mod description
	 */
	readonly description?: string;

	/**
	 * @deprecated
	 * Mod intents
	 */
	readonly intents?: Eris.IntentStrings[];

	/**
	 * Mod execution priorty
	 */
	readonly priority?: number = 0;

	/**
	 * Mod command cooldown
	 */
	readonly cooldown?: number = 5;

	/**
	 * Mod commands
	 */
	readonly commands?: ModCommand[] = [];

	// Mod events
	readonly events?: {
		/**
		 * Mod's callback function for mod initialization event
		 */
		onInit?: (mod: Yujin.Mod) => Promise<unknown>;

		/**
		 * Mod's callback function for message create event
		 */
		onMsgCreate?: (msg: Eris.Message, opt: { mod: Yujin.Mod }) => Promise<unknown>;

		/**
		 * Mod's callback function for message delete event
		 */
		onMsgDelete?: (msg: Eris.Message, opt: { mod: Yujin.Mod }) => Promise<unknown>;

		/**
		 * Mod's callback function for message update event
		 */
		onMsgUpdate?: (newMsg: Eris.Message, oldMsg: Eris.OldMessage, opt: { mod: Yujin.Mod }) => Promise<unknown>;

		/**
		 * Mod's callback function for voice state update event
		 */
		onVoiceUpdate?: (
			member: Eris.Member,
			state: Eris.VoiceState,
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;

		/**
		 * Mod's callback function for voice channel join event
		 */
		onVoiceJoin?: (
			member: Eris.Member,
			channel: Eris.VoiceChannel | Eris.StageChannel,
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;

		/**
		 * Mod's callback function for voice channel leave event
		 */
		onVoiceLeave?: (
			member: Eris.Member,
			channel: Eris.VoiceChannel | Eris.StageChannel,
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;

		/**
		 * Mod's callback function for voice switch event
		 */
		onVoiceSwitch?: (
			member: Eris.Member,
			newChannel: Eris.VoiceChannel | Eris.StageChannel,
			oldChannel: Eris.VoiceChannel | Eris.StageChannel,
			opt: {
				mod: Yujin.Mod;
			},
		) => Promise<unknown>;

		/**
		 * Mod's callback function for user changes
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
	 * Mod configs
	 */
	#configs: Map<string, any> = new Map();

	/**
	 * Mod datastores
	 */
	#datastores: Map<string, Yujin.Datastore> = new Map();

	/**
	 * Assign bot instance to this mod
	 * @param bot Yujin bot instance
	 */
	assign(bot: Yujin.Bot) {
		this.bot = bot;
	}

	/**
	 * Print invalid command usage
	 * @param msg Message to reference
	 * @param cmd Command to search for
	 * @param bot Bot instance
	 * @returns Created message
	 */
	printInvalidUsage(msg: Eris.Message, cmd: string, bot: Yujin.Bot): Promise<Eris.Message> {
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
	 * Get mod default config directory path
	 * @returns Path to folder
	 */
	getConfigDir(): string {
		if (!fs.existsSync(path.resolve(`./mods_data/${this.name}`)))
			fs.mkdirSync(path.resolve(`./mods_data/${this.name}`), { recursive: true });

		return path.resolve(`./mods_data/${this.name}`);
	}

	/**
	 * Get a mod config from data folder, all configs are JSON files
	 * @param name Name of the config file, defaults to 'config'
	 * @param forced Whether read the config from disk and re-cache it or not
	 * @returns
	 */
	getConfig(name = 'config', forced?: boolean): any {
		if (this.#configs.has(name) && !forced) return this.#configs.get(name);

		let data = undefined;
		fs.recursiveLookup(this.getConfigDir(), (file) => {
			if (path.basename(file) === `${name}.json`) {
				data = JSON.parse(fs.readFileSync(file, 'utf8'));
			}
		});

		this.#configs.set(name, data);
		return data;
	}

	/**
	 * Get a datastore from data folder
	 * @param name Name of the datastore, defaults to 'default'
	 * @param forced Whehter to forcefully read from file instead of cache
	 * @returns
	 */
	getDatastore(name = 'default', forced?: boolean): Yujin.Datastore {
		if (this.#datastores.has(name) && !forced) return this.#datastores.get(name);

		const datastore = new Yujin.Datastore(`${this.getConfigDir()}/data/${name}.db`);

		this.#datastores.set(name, datastore);
		return datastore;
	}

	/**
	 * Generate default config file
	 * @param defaultValue Value to store
	 * @param filename Name of the config, defaults to 'config'
	 */
	generateConfig(defaultValue: unknown, filename = 'config'): void {
		fs.writeFileSync(`${this.getConfigDir()}/${filename}.json`, JSON.stringify(defaultValue, undefined, 4), 'utf8');
		this.#configs.set(filename, defaultValue);
	}
}
