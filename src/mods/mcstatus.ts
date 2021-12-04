import { Intents, Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { SucklessBot } from "../core/class/sucklessbot";

const __trackers: any = {};

/**
 * Ping a minecraft server and its info
 *
 * @param {Message} message
 * @param {string[]} args
 * @param {SucklessBot} bot
 * @return {*}
 */
const Query = async (
    message: Message,
    args: string[],
    bot: SucklessBot
): Promise<void> => {
    if (!args) return;

    // use 'minevn.net' if no ip was given | use port 25565 if no other port was given
    const ip = args.length > 0 ? args.shift() : "minevn.net";
    const port = args.length > 0 ? Number(args.shift()) : 25565;

    fetch(`https://mcsrv.vercel.app/?ip=${ip}&port=${port}`).then((res) =>
        res
            .text()
            .then((txt) => {
                const json = JSON.parse(txt);
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor("#ed2261")
                            .setTimestamp()
                            .setTitle(`${json.host.toUpperCase()}`)
                            .setDescription(
                                `${json.description.descriptionText.replace(
                                    /§[a-z0-9]+/g,
                                    ""
                                )}`
                            )
                            .setThumbnail(`${bot.cli().user.avatarURL()}`)
                            .addField(
                                `Online`,
                                `${json.onlinePlayers}/${json.maxPlayers}`
                            )
                            .addField(`Version`, `${json.version}`),
                    ],
                });
            })
            .catch(() => {
                message.channel.send(
                    `I wasn't able to sneak up onto **${args.join()}** and steal their goodies`
                );
            })
    );
};

export = {
    name: "Minecraft Server Status",
    author: "acayrin",
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    command: ["mcstatus"],
    aliases: ["mc"],
    description: "Ping a minecraft server",
    usage: "%prefix% <command/alias> [ip:port]",
    onMsgCreate: Query,
};
