import { Intents, Message, MessageEmbed } from "discord.js";
import { SucklessBot } from "../core/class/sucklessbot";

export = {
	name: "Kiwi",
	description: "Kiwi",
	command: "kiwi",
	author: "kiwi",
	intents: [Intents.FLAGS.GUILDS],
	usage: "%prefix% kiwi",
	onMsgCreate: run,
};

const kiwis = [
	"https://i.kym-cdn.com/photos/images/original/001/263/042/cab.jpg",
	"https://img.buzzfeed.com/buzzfeed-static/static/2017-08/16/17/tmp/buzzfeed-prod-web-04/tmp-name-2-31487-1502920343-3_dblbig.jpg?resize=1200:*",
	"https://img.buzzfeed.com/buzzfeed-static/static/2017-08/14/15/asset/buzzfeed-prod-web-04/sub-buzz-2783-1502739685-1.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
	"https://i.pinimg.com/564x/9f/58/3f/9f583fc0e800f8062fb2aa593f8b51ca.jpg",
];
function run(message: Message, args: string[], bot: SucklessBot): void {
	if (!args) return;
	message.channel.send({
		embeds: [
			new MessageEmbed()
				.setTitle("Kiwi")
				.setImage(kiwis[Math.floor(Math.random() * kiwis.length)])
				.setColor("#00cc00")
				.setAuthor("Kiwi"),
		],
	});
}
