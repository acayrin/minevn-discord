"use strict";
exports.__esModule = true;
exports.getHelp = void 0;
var Discord = require("discord.js");
var getHelp = function (message, args, bot) {
    if (args && args[0]) {
        var mod = bot.cmdMgr.getMod(args[0]);
        if (!mod)
            return;
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor("#ed2261")
                    .setTimestamp()
                    .setThumbnail(bot.cli().user.avatarURL())
                    .setTitle("[Mod] ".concat(mod.name))
                    .setDescription("".concat(mod.description ||
                    "*This mod doesn't have any description*"))
                    .addField("Command: `` ".concat(bot.cmdMgr
                    .getCommands(mod)
                    .join(", "), " ``"), "Aliases: `` ".concat(bot.cmdMgr
                    .getAliases(mod)
                    .join(", "), " ``"))
                    .addField("Usage", "".concat(mod.usage.replace(/%prefix%+/, bot.config.prefix)))
                    .setFooter(mod.author ? "by ".concat(mod.author) : undefined),
            ]
        });
    }
    else if (args) {
        var mods_1 = [];
        bot.mods.forEach(function (mod) { return mods_1.push(mod.name); });
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor("#ed2261")
                    .setTimestamp()
                    .setThumbnail(bot.cli().user.avatarURL())
                    .setTitle("Guide on How to use this thing")
                    .setDescription("A some-what useful guide on how to use this thing, idk")
                    .addField("Loaded mods", "".concat(mods_1.join(", ")))
                    .addField("Availabe commands", "".concat(bot.cmdMgr.commands.join(", ")))
                    .addField("\u200B", "for command specific help, use `` ".concat(bot.config.prefix, " help <command> ``")),
            ]
        });
    }
};
exports.getHelp = getHelp;
