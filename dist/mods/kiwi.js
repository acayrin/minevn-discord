"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var Discord = __importStar(require("discord.js"));
var kiwis = [
    "https://i.kym-cdn.com/photos/images/original/001/263/042/cab.jpg",
    "https://img.buzzfeed.com/buzzfeed-static/static/2017-08/16/17/tmp/buzzfeed-prod-web-04/tmp-name-2-31487-1502920343-3_dblbig.jpg?resize=1200:*",
    "https://img.buzzfeed.com/buzzfeed-static/static/2017-08/14/15/asset/buzzfeed-prod-web-04/sub-buzz-2783-1502739685-1.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
    "https://i.pinimg.com/564x/9f/58/3f/9f583fc0e800f8062fb2aa593f8b51ca.jpg",
];
function run(message, args, bot) {
    if (!args)
        return;
    message.channel.send({
        embeds: [
            new Discord.MessageEmbed()
                .setTitle("Kiwi")
                .setImage(kiwis[Math.floor(Math.random() * kiwis.length)])
                .setColor("#00cc00")
                .setAuthor("Kiwi"),
        ]
    });
}
module.exports = {
    name: "Kiwi",
    description: "Kiwi",
    command: "kiwi",
    author: "kiwi",
    intents: [Discord.Intents.FLAGS.GUILDS],
    usage: "%prefix% kiwi",
    onMsgCreate: run
};
