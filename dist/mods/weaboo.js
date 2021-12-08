"use strict";
var discord_js_1 = require("discord.js");
var weaboo_1 = require("./weaboo/");
module.exports = {
    name: "Weaboo for Life",
    author: "not acayrin",
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
    command: ["wibu"],
    aliases: ["wb"],
    description: "Get some random anime pics\ntho some tags may have limited amount of pics (dont' blame me)",
    usage: "%prefix%<command/alias> [tag]",
    onMsgCreate: weaboo_1.SendImg
};
