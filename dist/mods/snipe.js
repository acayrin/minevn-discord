"use strict";
var discord_js_1 = require("discord.js");
var _m1 = [];
var _m2 = null;
var _m3 = null;
var Snipe = function (message, args, bot) {
    if (_m1.length >= bot.config.snipe.limit)
        _m1.pop();
    _m1.push({
        id: message.id,
        content: message.cleanContent,
        files: message.attachments || null,
        owner: message.author.tag,
        avatar: message.author.avatarURL()
    });
    if (!args)
        return;
    var arg = message.content.split(/ +/);
    arg.shift();
    var cmd = arg.shift().toLocaleLowerCase();
    switch (cmd) {
        case 's':
        case 'snipe': {
            if (!_m2)
                return;
            message.reply({
                embeds: [_e(_m2)],
                files: _m2.files || null
            });
            break;
        }
        case 'es':
        case 'editsnipe': {
            if (!_m3)
                return;
            message.reply({
                embeds: [_e(_m3)],
                files: _m3.files || null
            });
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
    var find = _m1.find(function (m) { return m.id.includes(message.id); });
    if (bot.debug && find)
        bot.logger.debug("[Snipe] Delete - ".concat(message.id, " => found ").concat(find.id || null));
    return _m2 = find;
};
var SnipeUpdate = function (oldMsg, newMsg, bot) {
    var find = _m1.find(function (m) { return m.id.includes(newMsg.id); });
    if (bot.debug && find)
        bot.logger.debug("[Snipe] Update - ".concat(newMsg.id, " => found ").concat(find.id || null));
    return _m3 = find;
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
    command: ["snipe", "editsnipe"],
    aliases: ["s", "es"],
    description: "Vote mute somebody cuz democracy is kul",
    usage: "%prefix% mute <Username>[/<Tag>/<User ID>]]",
    onMsgCreate: Snipe,
    onMsgDelete: SnipeDelete,
    onMsgUpdate: SnipeUpdate
};
