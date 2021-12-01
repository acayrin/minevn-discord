import * as Discord from "discord.js"
import * as fs from "fs"
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
     * @param {string} token? Your Discord bot token, if not specified, will use one in configuration instead
     * @param {boolean} debug? Enable debug mode
     * @memberof Bot
     */
    constructor (token?: string, debug?: boolean) {
        this.token = token || this.config.token
        this.debug = debug
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
     * Bot's Logger instance
     *
     * @private
     * @memberof Bot
     */
    public logger = new Logger()

    /**
     * Bot's configuration, contains token so DO NOT SHARE THIS !!
     *
     * @private
     * @memberof Bot
     */
    public readonly config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf-8'))

    /**
     * Bot's command collection
     *
     * @memberof Bot
     */
    public command = new Discord.Collection<string, DSMod>()

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
        this.logger.log(`Node ${process.version.match(/^v(\d+\.\d+)/)[1]}`)

        const intents: Discord.Intents[] = []

        fs.readdirSync(`${__dirname}/mods`).forEach(item => {
            // ignore any that isn't javascript
            if(!item.endsWith('.js'))
                return

            // temp to load any mods
            const mod: DSMod = require(`${__dirname}/mods/${item}`)
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
            if (mod.aliases)
                if (Array.isArray(mod.aliases))
                    mod.aliases.forEach(alias => this.command.set(alias, mod))
                else
                    this.command.set(mod.aliases, mod)
            if (Array.isArray(mod.command))
                mod.command.forEach(cmd => this.command.set(cmd, mod))
            else
                this.command.set(mod.command, mod)

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
        this.logger.log(`Allowed Intents: ${intents}`)
        this.client = new Discord.Client({ intents: intents })
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
            return this.command.forEach(mod => mod.onMsgCreate(message, null, this))
        
                    arg.shift()                     // prefix
        const cmd = arg.shift().toLocaleLowerCase() // command

        if (!this.command.has(cmd)) 
            return this.command.forEach(mod => mod.onMsgCreate(message, null, this))
        
        try {
            this.command.get(cmd).onMsgCreate(message, arg, this)
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
        this.command.forEach(mod => {
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
        this.command.forEach(mod => {
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