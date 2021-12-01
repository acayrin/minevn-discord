import * as Discord from "discord.js"
import * as fs from "fs"
import { CommandManager } from "./commandmanager"
import { DSMod } from "./interface/DSMod"
import { Logger } from "./logger"

/**
 * Discord Bot instance, wooo weee
 *
 * @export
 * @class Bot
 */
class Bot {
    /**
     * Creates an instance of Bot.
     * @param {string} token Your Discord bot token, if not specified, will use one in configuration instead
     * @param {boolean} debug Enable debug mode
     * @param {Discord.ClientOptions} clientOptions Client options, leave 'intents' empty, else if 'intents' are specified, they will override mods intents requirements
     * @memberof Bot
     */
    constructor (options?: { token?: string, debug?: boolean, clientOptions?: Discord.ClientOptions }) {
        this.token = options.token || this.config.token
        this.debug = options.debug
        this.clientOptions = options.clientOptions
    }
    
    /**
     * Bot's super secret token, DO NOT SHARE THIS !!
     *
     * @private
     * @type {string}
     * @memberof Bot
     */
    private token : string

    /**
     * Bot's debug mode (default off)
     *
     * @private
     * @type {boolean}
     * @memberof Bot
     */
    public debug : boolean = false

    /**
     * Bot's Client instance, for internal uses
     *
     * @private
     * @type {Discord.Client}
     * @memberof Bot
     */
    private client : Discord.Client

    /**
     * Bot's Client options
     *
     * @private
     * @type {Discord.ClientOptions}
     * @memberof Bot
     */
    private clientOptions : Discord.ClientOptions
    
    /**
     * Bot's Command manager instace
     *
     * @type {CommandManager}
     * @memberof Bot
     */
    public cmdMgr : CommandManager = new CommandManager()

    /**
     * Bot's Logger instance
     *
     * @private
     * @memberof Bot
     */
    public logger : Logger = new Logger()

    /**
     * Bot's configuration, contains token so DO NOT SHARE THIS !!
     *
     * @public
     * @memberof Bot
     */
    public readonly config = JSON.parse(fs.readFileSync(`${__dirname}/../../config.json`, 'utf-8'))

    /**
     * Bot's mods collection
     *
     * @memberof Bot
     */
    public mods : DSMod[] = []

    /**
     * Get the Bot's client
     *
     * @memberof Bot
     */
    public cli = () => this.client

    /**
     * Bot's startup phase
     *
     * @private
     * @memberof Bot
     */
    private init = () => {
        this.logger.log(`Platform ${process.platform} ${process.arch} - Node ${process.version.match(/^v(\d+\.\d+)/)[1]}`)

        let intents: any = []

        fs.readdirSync(`${__dirname}/../mods`).forEach(item => {
            // ignore any that isn't javascript
            if(!item.endsWith('.js'))
                return

            // temp to load any mods
            const mod: DSMod = require(`${__dirname}/../mods/${item}`)
            if (!mod.command || mod.command.length === 0)
                return this.logger.warn(`File mods/${item} is not a valid mod`)
        
            // ignore disabled
            if (mod.disabled) return
            
            // add required intents
            mod.intents.forEach(intent => {
                if (!intents.includes(intent))
                    intents.push(intent)
            })

            // add aliases first, then commands
            // to prevent aliases overlapping base commands
            this.cmdMgr.register(mod)
            this.mods.push(mod)

            // mod's init phase (if any)
            if (mod.onInit)
                mod.onInit(this)

            // logger
            this.logger.log(`Loaded mod: ${mod.name} (${item})`)

            // debug
            if (this.debug) {
                if (mod.aliases)
                this.logger.debug(`[STARTUP] ${mod.name} registered Aliases: ${mod.aliases.toString()}`)
                this.logger.debug(`[STARTUP] ${mod.name} registered Commands: ${mod.command.toString()}`)
                this.logger.debug(`[STARTUP] ${mod.name} requested Intents: ${mod.intents}`)
            }
        })

        // if bot is configured with intents, use those instead
        if (this.clientOptions.intents.toString() !== "")
            intents = this.clientOptions.intents

        this.logger.log(`Requested Intents: ${intents}`)
        this.logger.log(`Allowed Intents: ${intents} ${this.clientOptions.intents.toString() !== "" ? `(as in Bot options)` : `(from mods)`}`)
        this.client = new Discord.Client(Object.assign({}, this.clientOptions, { intents: intents }))
    }

    /**
     * Start the Bot instance
     *
     * @memberof Bot
     */
    public start() {
        this.init()
        this.client.login(this.token)
        this.client.on('ready', this.onConnect.bind(this))
        this.client.on('messageCreate', this.onMessage.bind(this))
        this.client.on('messageDelete', this.onDelete.bind(this))
        this.client.on('messageUpdate', this.onUpdate.bind(this))
        if (this.debug)
            this.client.on('debug', e => this.logger.debug(e))
    }

    /**
     * Triggers when Bot successfully connects to Discord
     *
     * @private
     * @memberof Bot
     */
    private onConnect = async () => {
        this.logger.log(`Bot connected as ${this.client.user.tag}`)
    }

    /**
     * Triggers when Bot receives a message
     *
     * @private
     * @param {Discord.Message} message Chat message
     * @memberof Bot
     */
    private onMessage = (message: Discord.Message) => {
        const arg = message.content.split(/ +/)
        if (arg.length === 1                                    // not enough arguments
            || !message.content.startsWith(this.config.prefix)) // doesnt start with prefix)
            return this.mods.forEach(mod => mod.onMsgCreate(message, undefined, this))
        
                    arg.shift()                     // prefix
        const cmd = arg.shift().toLocaleLowerCase() // command

        if (!this.cmdMgr.get(cmd)) 
            return this.mods.forEach(mod => mod.onMsgCreate(message, undefined, this))
        
        try {
            this.cmdMgr.get(cmd).onMsgCreate(message, arg, this)
        } catch (error) {
            this.logger.error(`Error while executing command '${message.content}'\n${error}`)
        }
    }

    /**
     * Triggers when Bot detects a deleted message
     *
     * @private
     * @param {Discord.Message} message
     * @memberof Bot
     */
    private onDelete = (message: Discord.Message) => {
        const mods: DSMod[] = []
        this.mods.forEach(mod => {
            if (!mods.includes(mod))
                mods.push(mod)
        })
        mods.forEach(mod => {
            if (mod.onMsgDelete)
                mod.onMsgDelete(message, message.content.split(/ +/), this)
        })
    }

    /**
     * Triggers when Bot detects a deleted message
     *
     * @private
     * @param {Discord.Message} old message
     * @param {Discord.Message} new message
     * @memberof Bot
     */
    private onUpdate = (oldMessage: Discord.Message, newMessage: Discord.Message) => {
        const mods: DSMod[] = []
        this.mods.forEach(mod => {
            if (!mods.includes(mod))
                mods.push(mod)
        })
        mods.forEach(mod => {
            if (mod.onMsgUpdate)
                mod.onMsgUpdate(oldMessage, newMessage, this)
        })
    }
}

export { Bot }