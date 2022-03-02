"use strict";
var discord_js_1 = require("discord.js");
var musicplayer_1 = require("./musicplayer/");
module.exports = {
    name: "MusicPlayer",
    description: "A simple music player since Susan decided to killed off most of available bots",
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES],
    command: ["player", "youtube"],
    aliases: "yt",
    usage: "Use ``%prefix%yt`` for full usage guide",
    author: "acayrin",
    onMsgCreate: musicplayer_1.CreatePlayer
};
