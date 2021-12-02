import * as Discord from "discord.js";
import * as fs from "fs";
import { dirname } from "path";
import { CommandManager } from "./commandmanager";
import { DSMod } from "../interface/DSMod";
import { Logger } from "./logger";

/**
 * Discord SucklessBot instance, wooo weee
 *
 * @export
 * @class SucklessBot
 */
class SucklessBot {
    /**
     * Creates an instance of SucklessBot.
     *
     * @param {string} token Your Discord bot token, if not specified, will use one in configuration instead
     * @param {boolean} debug Enable debug mode
     * @param {Discord.ClientOptions} clientOptions Client options, leave 'intents' empty, else if 'intents' are specified, they will override mods intents requirements
     * @memberof SucklessBot
     */
    constructor(options?: {
        token?: string;
        debug?: boolean;
        clientOptions?: Discord.ClientOptions;
    }) {
        this.token = options.token || this.config.token;
        this.debug = options.debug;
        this.clientOptions = options.clientOptions;
    }

    /**
     * SucklessBot's super secret token, DO NOT SHARE THIS !!
     *
     * @private
     * @type {string}
     * @memberof SucklessBot
     */
    private token: string;

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
    private client: Discord.Client;

    /**
     * SucklessBot's Client options
     *
     * @private
     * @type {Discord.ClientOptions}
     * @memberof SucklessBot
     */
    private clientOptions: Discord.ClientOptions;

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
     * SucklessBot's configuration, contains token so DO NOT SHARE THIS !!
     *
     * @public
     * @memberof SucklessBot
     */
    public readonly config = JSON.parse(
        fs.readFileSync(`${__dirname}/../../../config.json`, "utf-8")
    );

    /**
     * SucklessBot's mods collection
     *
     * @memberof SucklessBot
     */
    public readonly mods: DSMod[] = [];

    /**
     * Get the SucklessBot's client
     *
     * @memberof SucklessBot
     */
    public readonly cli = () => this.client;

    /**
     * SucklessBot's startup phase
     *
     * @private
     * @memberof SucklessBot
     */
    private init = () => {
        this.logger.log(
            `Platform ${process.platform} ${process.arch} - Node ${
                process.version.match(/^v(\d+\.\d+)/)[1]
            }`
        );

        const path = dirname(require.main.filename);
        let intents: any = [];

        fs.readdirSync(`${path}/mods`).forEach((item) => {
            // ignore any that isn't javascript
            if (!item.endsWith(".js")) return;

            // temp to load any mods
            const mod: DSMod = require(`${path}/mods/${item}`);
            if (!mod.command || mod.command.length === 0)
                return this.logger.warn(`File mods/${item} is not a valid mod`);

            // ignore disabled
            if (mod.disabled) return;

            // add required intents
            mod.intents.forEach((intent) => {
                if (!intents.includes(intent)) intents.push(intent);
            });

            // add aliases first, then commands
            // to prevent aliases overlapping base commands
            this.cmdMgr.register(mod);
            this.mods.push(mod);

            // mod's init phase (if any)
            if (mod.onInit) mod.onInit(this);

            // logger
            this.logger.log(`Loaded mod: ${mod.name} (${item})`);

            // debug
            if (this.debug) {
                if (mod.aliases)
                    this.logger.debug(
                        `[STARTUP] ${
                            mod.name
                        } registered Aliases: ${mod.aliases.toString()}`
                    );
                this.logger.debug(
                    `[STARTUP] ${
                        mod.name
                    } registered Commands: ${mod.command.toString()}`
                );
                this.logger.debug(
                    `[STARTUP] ${mod.name} requested Intents: ${mod.intents}`
                );
            }
        });

        // if bot is configured with intents, use those instead
        if (this.clientOptions.intents.toString() !== "")
            intents = this.clientOptions.intents;

        this.logger.log(`Requested Intents: ${intents}`);
        this.logger.log(
            `Allowed Intents: ${intents} ${
                this.clientOptions.intents.toString() !== ""
                    ? `(as in SucklessBot options)`
                    : `(from mods)`
            }`
        );
        this.client = new Discord.Client(
            Object.assign({}, this.clientOptions, { intents: intents })
        );
    };

    /**
     * Start the SucklessBot instance
     *
     * @memberof SucklessBot
     */
    public start() {
        this.init();
        this.client.login(this.token);
        this.client.on("ready", this.onConnect.bind(this));
        this.client.on("messageCreate", this.onMessage.bind(this));
        this.client.on("messageDelete", this.onDelete.bind(this));
        this.client.on("messageUpdate", this.onUpdate.bind(this));
        if (this.debug === "full")
            this.client.on("debug", (e) => this.logger.debug(e));
    }

    /**
     * Triggers when SucklessBot successfully connects to Discord
     *
     * @private
     * @memberof SucklessBot
     */
    private onConnect = async () => {
        this.logger.log(`SucklessBot connected as ${this.client.user.tag}`);
    };

    /**
     * Triggers when SucklessBot receives a message
     *
     * @private
     * @param {Discord.Message} message Chat message
     * @memberof SucklessBot
     */
    private onMessage = (message: Discord.Message) => {
        const arg = message.content.split(/ +/);
        if (
            arg.length === 1 || // not enough arguments
            !message.content.startsWith(this.config.prefix)
        )
            // doesnt start with prefix)
            return this.mods.forEach((mod) =>
                mod.onMsgCreate(message, undefined, this)
            );

        arg.shift(); // prefix
        const cmd = arg.shift().toLocaleLowerCase(); // command

        if (!this.cmdMgr.getMod(cmd))
            return this.mods.forEach((mod) =>
                mod.onMsgCreate(message, undefined, this)
            );

        try {
            this.cmdMgr.getMod(cmd).onMsgCreate(message, arg, this);
        } catch (error) {
            this.logger.error(
                `Error while executing command '${message.content}'\n${error}`
            );
        }
    };

    /**
     * Triggers when SucklessBot detects a deleted message
     *
     * @private
     * @param {Discord.Message} message
     * @memberof SucklessBot
     */
    private onDelete = (message: Discord.Message) => {
        const mods: DSMod[] = [];
        this.mods.forEach((mod) => {
            if (!mods.includes(mod)) mods.push(mod);
        });
        mods.forEach((mod) => {
            if (mod.onMsgDelete)
                mod.onMsgDelete(message, message.content.split(/ +/), this);
        });
    };

    /**
     * Triggers when SucklessBot detects a deleted message
     *
     * @private
     * @param {Discord.Message} old message
     * @param {Discord.Message} new message
     * @memberof SucklessBot
     */
    private onUpdate = (
        oldMessage: Discord.Message,
        newMessage: Discord.Message
    ) => {
        const mods: DSMod[] = [];
        this.mods.forEach((mod) => {
            if (!mods.includes(mod)) mods.push(mod);
        });
        mods.forEach((mod) => {
            if (mod.onMsgUpdate) mod.onMsgUpdate(oldMessage, newMessage, this);
        });
    };
}

export { SucklessBot };
