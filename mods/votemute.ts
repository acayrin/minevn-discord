import { Intents } from "discord.js"
import { VoteMute } from "./votemute/"

export = {
    name: "Vote mute",
    author: "acayrin",
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    command: "votemute",
    aliases: [ "vm" ],
    description: "Vote mute somebody cuz democracy is kul",
    usage: "%prefix% mute <Username>[/<Tag>/<User ID>]]",
    onMsgCreate: VoteMute
}