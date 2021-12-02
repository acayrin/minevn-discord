import { Intents } from "discord.js";
import { Snipe, SnipeDelete, SnipeUpdate } from "./snipe/";

export = {
    name: "Snipe",
    author: "acayrin",
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    command: ["snipe", "editsnipe", "clear"],
    aliases: ["s", "es"],
    description: "Snipe somebody and make their day miserable",
    usage: "%prefix% <command/alias> [step]",
    onMsgCreate: Snipe,
    onMsgDelete: SnipeDelete,
    onMsgUpdate: SnipeUpdate,
};
