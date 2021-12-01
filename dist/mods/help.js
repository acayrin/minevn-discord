"use strict";
var discord_js_1 = require("discord.js");
var core_1 = require("./core/");
module.exports = {
    name: "Help page",
    author: "acayrin",
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
    ],
    command: "help",
    aliases: ["h"],
    description: "Bot's help page",
    usage: "%prefix% <command/alias> [args]",
    onMsgCreate: core_1.getHelp
};
