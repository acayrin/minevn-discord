"use strict";
var discord_js_1 = require("discord.js");
var record_D = [];
var record_U = [];
var Snipe = function (message, args, bot) {
    if (!args)
        return;
    var arg = message.content.split(/ +/);
    arg.shift();
    var cmd = arg.shift().toLocaleLowerCase();
    var num = -1 - Math.abs(Number(arg.shift()));
    switch (cmd) {
        case 's':
        case 'snipe': {
            if (record_D.length < 1)
                return;
            var rep = record_D.at(num || -1);
            message.reply({
                embeds: [_e(rep)],
                files: rep.files || null
            });
            break;
        }
        case 'es':
        case 'editsnipe': {
            if (record_U.length < 1)
                return;
            var rep = record_U.at(num || -1);
            message.reply({
                embeds: [_e(rep)],
                files: rep.files || null
            });
            break;
        }
        case 'clear': {
            if (message.member.permissions.has('MANAGE_MESSAGES')) {
                record_U.length = 0;
                record_D.length = 0;
                if (bot.debug)
                    bot.logger.debug("[Snipe] Cleared local cache");
            }
            break;
        }
        default:
            message.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setColor('#ed2261')
                        .setTitle("Sniper")
                        .setThumbnail(bot.cli().user.avatarURL())
                        .setDescription("sus")
                        .addField('snipe', 'snipe a deleted message')
                        .addField('editsnipe', 'snipe an edited message')
                        .setTimestamp()
                ]
            });
    }
};
var SnipeDelete = function (message, args, bot) {
    if (record_D.length > bot.config.snipe.limit)
        record_D.shift();
    if (bot.debug)
        bot.logger.debug("[Snipe] Deleted +".concat(message.id, " (").concat(record_D.length, "/").concat(bot.config.snipe.limit, ")"));
    var files = [];
    message.attachments.forEach(function (file) {
        files.push(new discord_js_1.MessageAttachment(file.attachment, file.name));
    });
    return record_D.push({
        id: message.id,
        content: message.content,
        files: files,
        owner: message.author.tag,
        avatar: message.author.avatarURL()
    });
};
var SnipeUpdate = function (oldMsg, newMsg, bot) {
    if (record_U.length > bot.config.snipe.limit)
        record_U.shift();
    if (bot.debug)
        bot.logger.debug("[Snipe] Updated +".concat(oldMsg.id, " (").concat(record_U.length, "/").concat(bot.config.snipe.limit, ")"));
    var files = [];
    oldMsg.attachments.forEach(function (file) {
        files.push(new discord_js_1.MessageAttachment(file.attachment, file.name));
    });
    return record_U.push({
        id: oldMsg.id,
        content: oldMsg.content,
        files: files,
        owner: oldMsg.author.tag,
        avatar: oldMsg.author.avatarURL()
    });
};
var _e = function (a) {
    return new discord_js_1.MessageEmbed()
        .setColor('#ed2261')
        .setAuthor(a.owner, a.avatar)
        .setDescription(a.content)
        .setTimestamp();
};
module.exports = {
    name: "Snipe",
    author: "acayrin",
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES
    ],
    command: ["snipe", "editsnipe", "clear"],
    aliases: ["s", "es"],
    description: "Vote mute somebody cuz democracy is kul",
    usage: "%prefix% mute <Username>[/<Tag>/<User ID>]]",
    onMsgCreate: Snipe,
    onMsgDelete: SnipeDelete,
    onMsgUpdate: SnipeUpdate
};
