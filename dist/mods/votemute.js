"use strict";
var discord_js_1 = require("discord.js");
var vote_1 = require("./vote");
module.exports = {
    name: "Vote mute",
    author: "acayrin",
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    command: "votemute",
    aliases: ["vm"],
    description: "Vote mute somebody cuz democracy is kul",
    usage: "%prefix% <command/alias> <mention>[/<user ID>/<username>] [reason]",
    onMsgCreate: vote_1.VM
};
