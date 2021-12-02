"use strict";
var discord_js_1 = require("discord.js");
var getHelp_1 = require("./core/getHelp");
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
    onMsgCreate: getHelp_1.getHelp
};
