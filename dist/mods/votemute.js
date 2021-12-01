"use strict";
var discord_js_1 = require("discord.js");
var votemute_1 = require("./votemute/");
module.exports = {
    name: "Vote mute",
    author: "acayrin",
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    command: "votemute",
    aliases: ["vm"],
    description: "Vote mute somebody cuz democracy is kul",
    usage: "%prefix% mute <Username>[/<Tag>/<User ID>]]",
    onMsgCreate: votemute_1.VoteMute
};
