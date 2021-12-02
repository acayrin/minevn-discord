import { Intents } from "discord.js";
import { getHelp } from "./core/getHelp";

export = {
    name: "Help page",
    author: "acayrin",
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    command: "help",
    aliases: ["h"],
    description: "Bot's help page",
    usage: "%prefix% <command/alias> [args]",
    onMsgCreate: getHelp,
};
