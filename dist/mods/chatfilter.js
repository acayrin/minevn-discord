"use strict";
var discord_js_1 = require("discord.js");
var chatfilter_1 = require("./chatfilter/");
var cf = new chatfilter_1.chatfilter();
module.exports = {
    name: "ChatFilter",
    author: "acayrin",
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
    description: "Filter bad words",
    usage: "%prefix%<command/alias> [args]",
    onInit: function (bot) { return cf.load(bot.configs.get("chatfilter.json")['url']); },
    onMsgCreate: function (message, args, bot) { return cf.makeThisChatClean(message, bot); },
    onMsgUpdate: function (oldMsg, newMsg, bot) { return cf.makeThisChatClean(newMsg, bot); }
};
