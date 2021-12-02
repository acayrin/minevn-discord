"use strict";
exports.__esModule = true;
exports.SnipeUpdate = exports.SnipeDelete = exports.Snipe = void 0;
var discord_js_1 = require("discord.js");
var record_D = {};
var record_U = {};
var Snipe = function (message, args, bot) {
    _c(message.channelId);
    if (!args)
        return;
    var arg = message.content.split(/ +/);
    arg.shift();
    var cmd = arg.shift().toLocaleLowerCase();
    var num = -1 - Math.abs(Number(arg.shift()));
    switch (cmd) {
        case "s":
        case "snipe": {
            if (record_D[message.channelId].length < 1)
                return;
            var rep = record_D[message.channelId].at(num || -1);
            message.reply({
                embeds: [_e(rep)],
                files: rep.files || null
            });
            break;
        }
        case "es":
        case "editsnipe": {
            if (record_U[message.channelId].length < 1)
                return;
            var rep = record_U[message.channelId].at(num || -1);
            message.reply({
                embeds: [_e(rep)],
                files: rep.files || null
            });
            break;
        }
        case "clear": {
            if (message.member.permissions.has("MANAGE_MESSAGES")) {
                record_U[message.channelId].length = 0;
                record_D[message.channelId].length = 0;
                if (bot.debug)
                    bot.logger.debug("[Snipe - ".concat(message.channelId, "] Cleared local cache"));
            }
            break;
        }
        default: {
        }
    }
};
exports.Snipe = Snipe;
var SnipeDelete = function (message, args, bot) {
    _c(message.channelId);
    if (record_D[message.channelId].length > bot.config.snipe.limit)
        record_D[message.channelId].shift();
    if (bot.debug)
        bot.logger.debug("[Snipe - ".concat(message.channelId, "] Deleted +").concat(message.id, " (").concat(record_D[message.channelId].length, "/").concat(bot.config.snipe.limit, ")"));
    var files = [];
    message.attachments.forEach(function (file) {
        files.push(new discord_js_1.MessageAttachment(file.attachment, file.name));
    });
    return record_D[message.channelId].push({
        id: message.id,
        content: message.content,
        files: files,
        owner: message.author.tag,
        avatar: message.author.avatarURL()
    });
};
exports.SnipeDelete = SnipeDelete;
var SnipeUpdate = function (oldMsg, newMsg, bot) {
    _c(oldMsg.channelId);
    if (record_U[oldMsg.channelId].length > bot.config.snipe.limit)
        record_U[oldMsg.channelId].shift();
    if (bot.debug)
        bot.logger.debug("[Snipe - ".concat(oldMsg.channelId, "] Updated +").concat(oldMsg.id, " (").concat(record_U[oldMsg.channelId].length, "/").concat(bot.config.snipe.limit, ")"));
    var files = [];
    oldMsg.attachments.forEach(function (file) {
        files.push({ attachment: file.attachment, name: file.name });
    });
    return record_U[oldMsg.channelId].push({
        id: oldMsg.id,
        content: oldMsg.content,
        files: files,
        owner: oldMsg.author.tag,
        avatar: oldMsg.author.avatarURL()
    });
};
exports.SnipeUpdate = SnipeUpdate;
var _c = function (ch) {
    if (!record_D[ch])
        record_D[ch] = [];
    if (!record_U[ch])
        record_U[ch] = [];
};
var _e = function (a) {
    return new discord_js_1.MessageEmbed()
        .setColor("#ed2261")
        .setAuthor(a.owner, a.avatar)
        .setDescription(a.content)
        .setTimestamp();
};
