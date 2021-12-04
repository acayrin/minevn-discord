import { Message, MessageEmbed } from "discord.js";
import { SucklessBot } from "../../core/class/sucklessbot";
import { __all, __random } from "./functions";

/**
 * Send an anime pic, from nekos.life and nekos.fun
 *
 * @param {Message} message
 * @param {string[]} args
 * @param {SucklessBot} bot
 * @return {*}
 */
export async function SendImg(
    message: Message,
    args: string[],
    bot: SucklessBot
): Promise<any> {
    let tag: string;

    if (!args) {
        return;
    } else {
        // if no args was given, get a random pic
        if (args.length === 0) {
            // empty
        } else if (args.join().toLowerCase().match(/list/)) {
            // if list was given, send available tags
            return message.reply(`**Available tags:** ${__all.join(", ")}`);
        } else {
            // use user's given tag
            tag = args.join();
        }
    }

    // get a random image
    const img = await __random(tag);
    if (img)
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Here ya go`)
                    .setImage(img)
                    .setAuthor(message.author.tag)
                    .setTimestamp(),
            ],
        });
    else message.reply(`I couldn't find any image with the tag **${tag}**`);
}
