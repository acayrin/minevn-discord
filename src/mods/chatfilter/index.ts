import { Message, MessageEmbed, Webhook } from "discord.js";
import { SucklessBot } from "../../core/sucklessbot";
import { database } from "./database";
import { filter } from "./filter";
import { whook } from "./webhook";

export class chatfilter {
    private __filter: filter = undefined;

    constructor(url?: string) { 
        // load filter list
        if (url) database.loadDB(url).then(db => this.__filter = new filter(db));
    };

    /**
     * Load filter
     *
     * @param {string} url filter list url
     * @memberof chatfilter
     */
    public load(url: string): void {
        database.loadDB(url).then(db => this.__filter = new filter(db));
    };

    /**
     * Check if the message is cursed or not then process it
     * @param message input message
     * @param bot suckless bot instance
     */
    public async makeThisChatClean(message: Message, bot: SucklessBot): Promise<void> {
        // ignore bot + non-text based channels
        if (message.author.bot || !message.channel.isText())
            return;
        
        // get webhook
        const webhook: Webhook = await (new whook(bot, message.channel)).getHook();

        // filter message
        const __d_start = Date.now();
        this.__filter.adv_replace(message.content).then(out => {
            // if message is different
            if (out[0] !== message.content) {
                // workaround for attachments
                const atc: any = message.attachments;
    
                // replace and cleanup;
                webhook.send({
                    content: out[0],
                    username: message.member?.nickname || message.author.username,
                    avatarURL: message.member?.avatarURL() || message.author.avatarURL(),
                    embeds: [
                        new MessageEmbed()
                            .setColor(0xf5f5f5)
                            .setDescription("*Lưu ý: Sử dụng từ ngữ không hợp lệ quá nhiều sẽ khiến bạn bị mút!*")
                            .setFooter(`${bot.cli().user.tag} :: bad [${out[1]}] - cks [${out[2]}] - time [${Date.now() - __d_start}ms]`, bot.cli().user.avatarURL())
                    ].concat(message.embeds),
                    files: atc
                }).finally(() => message.delete());
            };
        });
    };
};