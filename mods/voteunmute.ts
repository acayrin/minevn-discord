import { Intents } from "discord.js"
import { VUM } from "./vote"

export = {
    name: "Vote un-mute",
    author: "acayrin",
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    command: "voteunmute",
    aliases: [ "vum" ],
    description: "Vote somebody cuz democracy is kul",
    usage: "%prefix% %command% <Username>[/<Tag>/<User ID>]]",
    onMsgCreate: VUM
}