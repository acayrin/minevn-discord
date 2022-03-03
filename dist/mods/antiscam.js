"use strict";
var discord_js_1 = require("discord.js");
module.exports = {
    name: "AntiScam",
    author: "acayrin",
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
    description: "Remove all* messages that are possibly scam",
    usage: "none",
    onMsgCreate: function (msg, args, bot) {
        var _a, _b;
        if (((_a = msg.embeds) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            var title = (_b = msg.embeds) === null || _b === void 0 ? void 0 : _b.at(0).title;
            if ((title === null || title === void 0 ? void 0 : title.match(/free/gi)) && (title === null || title === void 0 ? void 0 : title.match(/nitro/gi))) {
                msg["delete"]();
            }
        }
    }
};
