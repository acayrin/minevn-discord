import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import { Bot } from "../../core/class/bot";
import { DSChatRecord } from "./DSChatRecord";

const record_D: any = {};
const record_U: any = {};
/**
 * Triggers when a message is sent
 *
 * @param {Message} message The message
 * @param {string[]} args Arguments from message
 * @param {Bot} bot The bot instance
 */
const Snipe = (message: Message, args: string[], bot: Bot) => {
    // check
    _c(message.channelId);

    // if message is not a command
    if (!args) return;

    const arg = message.content.split(/ +/);
    arg.shift();
    const cmd = arg.shift().toLocaleLowerCase();
    const num = -1 - Math.abs(Number(arg.shift()));

    switch (cmd) {
        // normal snipe
        case "s":
        case "snipe": {
            if (record_D[message.channelId].length < 1) return;

            const rep = record_D[message.channelId].at(num || -1);
            message.reply({
                embeds: [_e(rep)],
                files: rep.files || null,
            });
            break;
        }
        // edit snipe
        case "es":
        case "editsnipe": {
            if (record_U[message.channelId].length < 1) return;

            const rep = record_U[message.channelId].at(num || -1);
            message.reply({
                embeds: [_e(rep)],
                files: rep.files || null,
            });
            break;
        }
        // clear everything
        case "clear": {
            if (message.member.permissions.has("MANAGE_MESSAGES")) {
                record_U[message.channelId].length = 0;
                record_D[message.channelId].length = 0;

                // debug
                if (bot.debug) bot.logger.debug(`[Snipe] Cleared local cache`);
            }
            break;
        }
        default: {
            // how tf did you get here
        }
    }
};

/**
 * Triggers when a message gets deleted
 *
 * @param {Message} message The deleted message
 * @param {*} args empty
 * @param {Bot} bot The bot instance
 */
const SnipeDelete = (message: Message, args: any, bot: Bot) => {
    // check
    _c(message.channelId);

    // shift oldest record
    if (record_D[message.channelId].length > bot.config.snipe.limit)
        record_D[message.channelId].shift();

    // debug
    if (bot.debug)
        bot.logger.debug(
            `[Snipe] Deleted +${message.id} (${
                record_D[message.channelId].length
            }/${bot.config.snipe.limit})`
        );

    // get attachments
    const files: MessageAttachment[] = [];
    message.attachments.forEach((file) => {
        files.push(new MessageAttachment(file.attachment, file.name));
    });

    // add record
    return record_D[message.channelId].push({
        id: message.id,
        content: message.content,
        files: files,
        owner: message.author.tag,
        avatar: message.author.avatarURL(),
    });
};

/**
 * Triggers when a message gets updated
 *
 * @param {Message} oldMsg The old message
 * @param {Message} newMsg The updated message
 * @param {*} args empty
 * @param {Bot} bot The bot instance
 */
const SnipeUpdate = (oldMsg: Message, newMsg: Message, bot: Bot) => {
    // check
    _c(oldMsg.channelId);

    // shift oldest record
    if (record_U[oldMsg.channelId].length > bot.config.snipe.limit)
        record_U[oldMsg.channelId].shift();

    // debug
    if (bot.debug)
        bot.logger.debug(
            `[Snipe] Updated +${oldMsg.id} (${
                record_U[oldMsg.channelId].length
            }/${bot.config.snipe.limit})`
        );

    // get attachments
    const files: { attachment: any; name: string }[] = [];
    oldMsg.attachments.forEach((file) => {
        files.push({ attachment: file.attachment, name: file.name });
    });

    // add record
    return record_U[oldMsg.channelId].push({
        id: oldMsg.id,
        content: oldMsg.content,
        files: files,
        owner: oldMsg.author.tag,
        avatar: oldMsg.author.avatarURL(),
    });
};

/**
 * Creates channel record if doesnt exist
 *
 * @param {string} ch channel id
 */
const _c = (ch: string) => {
    if (!record_D[ch]) record_D[ch] = [];
    if (!record_U[ch]) record_U[ch] = [];
};

/**
 * Generates a new embed, for snipe responses
 *
 * @param {DSChatRecord} a Chat record
 * @return {MessageEmbed} Discord embed
 */
const _e = (a: DSChatRecord): MessageEmbed => {
    return new MessageEmbed()
        .setColor("#ed2261")
        .setAuthor(a.owner, a.avatar)
        .setDescription(a.content)
        .setTimestamp();
};

export { Snipe, SnipeDelete, SnipeUpdate };
