import { Message, MessageEmbed, Webhook } from "discord.js";
import { SucklessBot } from "../../core/sucklessbot";
import { filter } from "./filter";
import { preload } from "./preload";
import { whook } from "./webhook";

export class chatfilter {
    private __filter: filter = undefined;
    private __list: string[] = undefined;

    constructor() {};
    
    public async makeThisChatClean(message: Message, args: string[], bot: SucklessBot): Promise<void> {
        // ignore bot + non-text based channels
        if (message.author.bot || !message.channel.isText())
            return;
        
        // list
        if (!this.__list)
            this.__list = await preload.loadDB("https://raw.githubusercontent.com/minhquantommy/CircusBot/main/badwords.json");
        
        // get filter
        this.__filter = new filter(this.__list);
        
        // get webhook
        const webhook: Webhook = await (new whook(bot, message.channel)).getHook();

        // filter message
        const __d_start = Date.now();
        this.__filter.adv_replace(message.content).then(out => {
            if (out[0] !== message.content) {
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
}1