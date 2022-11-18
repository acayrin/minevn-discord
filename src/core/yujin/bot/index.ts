import Eris from 'eris';
import fs from 'fs';
import path from 'path';

import Yujin from '../';
import { CommandManager } from '../../manager/command/CommandManager';
import { Logger } from '../../utils/logger';
import Base from '../cluster/classes/Base';
import { EventBase } from './events/base/EventBase';

//const project_root = path.resolve('./');
const file_root = path.dirname(__dirname);

/**
 * @description Yujin bot instance
 * @export
 * @class BaseBot
 * @extends {Base}
 */
export default class BaseBot extends Base {
	/**
	 * Create a new bot instance
	 * @memberof BaseBot
	 */
	constructor(props?: Yujin.BaseClassProps, clientOptions?: Eris.ClientOptions) {
		if (props) super(props);
		else
			super({
				client: undefined,
				ipc: undefined,
				clusterID: undefined,
			});

		if (!props) this.logger = new Logger();
		if (clientOptions) this.#clientOptions = clientOptions;
	}

	/**
	 * @description Bot logger
	 * @type {Logger}
	 * @memberof BaseBot
	 */
	readonly logger: Logger;

	/**
	 * @description Bot Client options
	 * @type {Eris.ClientOptions}
	 * @memberof BaseBot
	 */
	#clientOptions: Eris.ClientOptions;

	/**
	 * @description Bot command manager
	 * @type {CommandManager}
	 * @memberof BaseBot
	 */
	readonly commandManager: CommandManager = new CommandManager();

	/**
	 * @description Bot mod list
	 * @type {Yujin.Mod[]}
	 * @memberof BaseBot
	 */
	readonly mods: Yujin.Mod[] = [];

	/**
	 * @description Bot's prefix
	 * @type {string}
	 * @memberof BaseBot
	 */
	readonly prefix: string = process.env.YUJIN_PREFIX || '>>';

	/**
	 * @description Bot's primary color (mainly for embed)
	 * @type {string}
	 * @memberof BaseBot
	 */
	readonly color: string = process.env.YUJIN_COLOR || '#ff3333';

	/**
	 * @description Bot runtime database, for storing temporal data
	 * @type {Map<string, any>}
	 * @memberof BaseBot
	 */
	readonly database: Yujin.TempDB<any> = new Yujin.TempDB();

	/**
	 * @description Log info message
	 * @memberof BaseBot
	 */
	info(msg: string) {
		if (this.logger) return this.logger.info(msg);

		if (this.client.ready)
			this.client.shards.forEach((shard) => {
				this.client.emit('info', msg, shard.id);
			});
		else this.client.emit('info', msg);
	}

	/**
	 * @description Log warn message
	 * @memberof BaseBot
	 */
	warn(msg: string) {
		if (this.logger) return this.logger.warn(msg);

		if (this.client.ready)
			this.client.shards.forEach((shard) => {
				this.client.emit('warn', msg, shard.id);
			});
		else this.client.emit('warn', msg);
	}

	/**
	 * @description Log error message
	 * @memberof BaseBot
	 */
	error(err: Error) {
		if (this.logger) return this.logger.error(err);

		if (this.client.ready)
			this.client.shards.forEach((shard) => {
				this.client.emit('error', err, shard.id);
			});
		else this.client.emit('error', err);
	}

	/**
	 * @description Bot init
	 * @memberof BaseBot
	 */
	init() {
		if (!this.client) {
			this.client = new Eris.Client(process.env.YUJIN_TOKEN, this.#clientOptions);
			this.client.connect();
			this.client.on('ready', (_) => this.#start());
		} else {
			this.#start();
		}
	}

	/**
	 * @description Bot start phase
	 * @memberof BaseBot
	 */
	async #start() {
		this.info('[CORE] Booting up the bot, please hold...');

		// start timestamp
		const start = Date.now();

		// handle client events
		this.client.editStatus('idle', {
			type: 1,
			name: 'setup, please wait',
		});

		await this.#loadMods();
		await this.#loadInitHooks();
		await this.#loadEventListeners();
		this.#loadSlashCommands();

		this.client.editStatus('online', undefined);
		this.info(
			`[CORE] Setup completed - Logged in as ${this.client.user.tag()}  (took ${Math.round(
				(Date.now() - start) / 1_000,
			)}s)`,
		);

		this.client.on('disconnect', () => {
			this.warn('[CORE] Bot has been disconnected from server, reconnecting soon');
			// this.__client.connect();
		});

		process.on('unhandledRejection', (e: Error) => {
			this.error({
				name: 'CORE',
				message: e.message,
				cause: e.cause,
				stack: e.stack,
			});
		});

		process.on('uncaughtException', (e) => {
			this.error({
				name: 'CORE',
				message: e.message,
				cause: e.cause,
				stack: e.stack,
			});
		});
	}

	/**
	 * @description Bot mods loading phase
	 * @memberof BaseBot
	 */
	async #loadMods() {
		this.info('[CORE] Loading mods...');
		await Promise.all(
			fs.recursiveList(path.resolve(`${file_root}/../../mods`)).map(async (item: string) => {
				// ignore any that isn't javascript
				if (!item.endsWith('.js')) return;

				// temp to load any mods
				try {
					const mod = new (await import(item)).default();
					if (!(mod instanceof Yujin.Mod)) return this.warn(`[CORE] Skipping invalid mod file ${item}`);

					if (!mod) {
						// this.error(`[CORE] Failed to load mod "${item}"`);
						return;
					}

					// ignore disabled
					if (process.env.YUJIN_DISABLED_MODS?.split(',').includes(mod.name.toLowerCase()) || mod.disabled)
						return;

					// binding bot
					mod.assign(this);

					// add aliases first, then commands
					// to prevent aliases overlapping base commands
					this.commandManager.register(mod);
					this.mods.push(mod);

					// logger
					this.info(`[CORE] Loaded mod: ${mod.name} (${item})`);
					this.info(`[CORE] - ${mod.name} registered ${mod.commands?.length} commands`);
					this.info(`[CORE] - ${mod.name} requested Intents: ${mod.intents}`);
				} catch (e: unknown) {
					this.warn(`[CORE] Skipping invalid mod file ${item}\n${e}`);
				}
			}),
		);

		// re-order mods based on priorty
		this.mods.sort((m1, m2) => m2.priority - m1.priority);
		this.info('[CORE] Mods priority (execution order):');
		this.mods.forEach((mod) => this.info(`[CORE] - [${mod.priority}] ${mod.name}`));
	}

	/**
	 * @description Bot slash commands loading phase
	 * @memberof BaseBot
	 */
	async #loadSlashCommands() {
		this.info('[CORE] Removing unused slash commands...');
		await Promise.all(
			(
				await this.client.getCommands()
			).map(async (cmd) => {
				if (
					!this.mods.find((mod) =>
						mod.commands?.find(
							(slash) => slash.name.toLowerCase() === cmd.name.toLowerCase() && slash.type === 'slash',
						),
					)
				) {
					await this.client.deleteCommand(cmd.id);
					this.info(`[CORE] - /${cmd.name} - ${cmd.description}`);
				}
			}),
		);

		this.info('[CORE] Lazy adding slash commands...');
		const existingCommands = await this.client.getCommands();
		await Promise.all(
			this.mods.map(async (mod) => {
				if (mod.commands.filter((cmd) => cmd.type === 'slash').length === 0) {
					return this.info(`[CORE] ? [${mod.name}]`);
				}

				await Promise.all(
					mod.commands.map(async (slash) => {
						if (slash.type !== 'slash') return;

						const eslash = existingCommands.find((c) => c.name.toLowerCase() === slash.name.toLowerCase());
						if (eslash) {
							await this.client
								.editCommand(eslash.id, {
									name: slash.name,
									description: slash.description,
									type: 1,
									options: slash.options,
								})
								.then((_) =>
									this.info(
										`[CORE] @ [${mod.name}] /${slash.name} - ${slash.options?.length || 0} opts`,
									),
								)
								.catch((e) =>
									this.error({
										name: 'CORE',
										message: `Failed edit command "${slash.name}"`,
										cause: e.cause,
										stack: e.stack,
									}),
								);
						} else {
							await this.client
								.createCommand({
									name: slash.name,
									description: slash.description,
									type: 1,
									options: slash.options,
								})
								.then((_) =>
									this.info(
										`[CORE] @ [${mod.name}] /${slash.name} - ${slash.options?.length || 0} opts`,
									),
								)
								.catch((e) =>
									this.error({
										name: 'CORE',
										message: `Failed create command "${slash.name}"`,
										cause: e.cause,
										stack: e.stack,
									}),
								);
						}
					}),
				);
			}),
		);
	}

	/**
	 * @description Bot init hooks phase
	 * @memberof BaseBot
	 */
	async #loadInitHooks() {
		this.info('[CORE] Running init hooks...');
		await Promise.all(
			this.mods.map(async (mod) => {
				// mod's init phase (if any)
				if (mod.events?.onInit)
					try {
						await mod.events.onInit(mod);
						this.info(`[CORE] - Completed init hook for ${mod.name}`);
					} catch (e) {
						this.error({
							name: 'CORE',
							message: `Failed to run init hook for mod "${mod.name}"`,
							cause: e.cause,
							stack: e.stack,
						});
					}
			}),
		);
	}

	/**
	 * @description Bot event listeners loading phase
	 * @memberof BaseBot
	 */
	async #loadEventListeners() {
		// load event listeners
		this.info('[CORE] Loading event listeners...');
		await Promise.all(
			fs.recursiveList(`${file_root}/bot/events`).map(async (file: string) => {
				if (!file.endsWith('.js') || file.includes('EventBase.js')) return;
				try {
					// import
					const event: EventBase = new (await import(file)).default();

					// bind suckless instance
					event.bind(this);

					// process
					this.client.on(event.event, event.process);

					this.info(`[CORE] - Registered event handler: ${event.name}`);
				} catch (e) {
					this.error({
						name: 'CORE',
						message: `Failed to load event handler "${file}"`,
						cause: e.cause,
						stack: e.stack,
					});
				}
			}),
		);
	}
}
