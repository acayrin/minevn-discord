import { Intents, Message, MessageEmbed } from "discord.js"
import fetch from "node-fetch"
import { Bot } from "../core/bot"

const Query = (message: Message, args: string[], bot: Bot) => {
    if (!args) return

    const ip = args.length > 0 ? args.join('') : 'minevn.net'
    fetch(`https://mcsrv.vercel.app/?ip=${ip}`)
    .then(res => res.text()
    .then(txt => {
        const json = JSON.parse(txt)
        message.channel.send({ embeds: [
            new MessageEmbed()
                .setColor('#ed2261')
                .setTimestamp()
                .setTitle(`${json.host.toUpperCase()}`)
                .setDescription(`${json.description.descriptionText.replace(/§[a-z0-9]+/g, '')}`)
                .setThumbnail(`${bot.cli().user.avatarURL()}`)
                .addField(`Online`, `${json.onlinePlayers}/${json.maxPlayers}`)
                .addField(`Version`, `${json.version}`)
        ]})
    })
    .catch(() => {
        message.channel.send(`I wasn't able to sneak up onto **${args.join()}** and steal their goodies`)
    }))
}

export = {
    name: "Minecraft Server Status",
    author: "acayrin",
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
    command: [ "mcstatus" ],
    aliases: [ "mc" ],
    description: "Ping a minecraft server",
    usage: "%prefix% <command/alias> [ip:port]",
    onMsgCreate : Query
}
