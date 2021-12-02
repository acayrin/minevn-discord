"use strict";
var discord_js_1 = require("discord.js");
var node_fetch_1 = require("node-fetch");
var Query = function (message, args, bot) {
    if (!args)
        return;
    var ip = args.length > 0 ? args.join('') : 'minevn.net';
    (0, node_fetch_1["default"])("https://mcsrv.vercel.app/?ip=".concat(ip))
        .then(function (res) { return res.text()
        .then(function (txt) {
        var json = JSON.parse(txt);
        message.channel.send({ embeds: [
                new discord_js_1.MessageEmbed()
                    .setColor('#ed2261')
                    .setTimestamp()
                    .setTitle("".concat(json.host.toUpperCase()))
                    .setDescription("".concat(json.description.descriptionText.replace(/§[a-z0-9]+/g, '')))
                    .setThumbnail("".concat(bot.cli().user.avatarURL()))
                    .addField("Online", "".concat(json.onlinePlayers, "/").concat(json.maxPlayers))
                    .addField("Version", "".concat(json.version))
            ] });
    })["catch"](function () {
        message.channel.send("I wasn't able to sneak up onto **".concat(args.join(), "** and steal their goodies"));
    }); });
};
module.exports = {
    name: "Minecraft Server Status",
    author: "acayrin",
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES
    ],
    command: ["mcstatus"],
    aliases: ["mc"],
    description: "Ping a minecraft server",
    usage: "%prefix% <command/alias> [ip:port]",
    onMsgCreate: Query
};
