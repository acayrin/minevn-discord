"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.getHelp = void 0;
var Discord = __importStar(require("discord.js"));
var getHelp = function (message, args, bot) {
    var _a, _b;
    if (args === null || args === void 0 ? void 0 : args[0]) {
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
                    .setDescription("".concat((_a = mod.description) !== null && _a !== void 0 ? _a : "*This mod doesn't have any description*"))
                    .addField("Command: `` ".concat(bot.cmdMgr.getCommands(mod).join(", "), " ``"), "Aliases: `` ".concat(bot.cmdMgr.getAliases(mod).join(", "), " ``"))
                    .addField("Usage", "".concat(mod.usage.replace(/%prefix%+/, bot.config.prefix)))
                    .setFooter("by ".concat((_b = mod.author) !== null && _b !== void 0 ? _b : "unknown")),
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
