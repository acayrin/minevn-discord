"use strict";
var discord_js_1 = require("discord.js");
module.exports = {
    name: "AntiScam",
    author: "acayrin",
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
    command: [],
    aliases: [],
    description: "Remove all* messages that are possibly scam",
    usage: "none",
    onMsgCreate: function (msg, args, bot) {
        if (msg.embeds.length > 0) {
            var title = msg.embeds.at(0).title;
            if (title.match(/free/gi) && title.match(/nitro/gi)) {
                msg["delete"]();
            }
        }
    }
};
