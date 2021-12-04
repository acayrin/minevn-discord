import { Intents } from "discord.js";
import { VUM } from "./vote";

export = {
    name: "Vote unmute",
    author: "acayrin",
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    command: "voteunmute",
    aliases: ["vum"],
    description: "Vote unmute somebody cuz democracy is kul",
    usage: "%prefix% <command/alias> <mention>[/<user id>/<username>] [reason]",
    onMsgCreate: VUM,
};
