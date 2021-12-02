"use strict";
var discord_js_1 = require("discord.js");
var snipe_1 = require("./snipe/");
module.exports = {
    name: "Snipe",
    author: "acayrin",
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
    command: ["snipe", "editsnipe", "clear"],
    aliases: ["s", "es"],
    description: "Snipe somebody and make their day miserable",
    usage: "%prefix% <command/alias> [step]",
    onMsgCreate: snipe_1.Snipe,
    onMsgDelete: snipe_1.SnipeDelete,
    onMsgUpdate: snipe_1.SnipeUpdate
};
