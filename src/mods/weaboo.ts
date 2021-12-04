import { Intents } from "discord.js";
import { SendImg } from "./weaboo/";

export = {
    name: "Weaboo for Life",
    author: "not acayrin",
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    command: ["wibu"],
    aliases: ["wb"],
    description:
        "Get some random anime pics\ntho some tags may have limited amount of pics (dont' blame me)",
    usage: "%prefix% <command/alias> [tag]",
    onMsgCreate: SendImg,
};
