import { TextChannel, Webhook } from "discord.js";
import { SucklessBot } from "../../core/SucklessBot";

export class whook {
    private __bot: SucklessBot = undefined;
    private __channel: TextChannel = undefined;

    constructor(bot: SucklessBot, channel: any) {
        this.__bot = bot;
        this.__channel = channel;   
    };
    
    /**
     * Get a webhook, if not found, create a new one
     * @returns Webhook
     */
    public async getHook(): Promise<Webhook> {
        return (await this.__channel.fetchWebhooks()).find((h: Webhook) => h.owner.id === this.__bot.cli().user.id) || this.createHook();
    }

    /**
     * Create a webhook
     * @param channel text channel
     * @returns webhook
     */
    public async createHook(channel?: TextChannel): Promise<Webhook> {
        return await (channel || this.__channel).createWebhook(this.__bot.cli().user.username, {
            avatar: this.__bot.cli().user.avatarURL()
        });
    }
}