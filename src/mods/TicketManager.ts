import { SucklessMod } from "../core/interface/SucklessMod";
import { CategoryChannel, GuildChannel, Intents, Message, MessageEmbed, PartialMessage, Permissions } from "discord.js";
import { SucklessBot } from "../core/SucklessBot";
import { id } from "../core/utils/GenerateId";

export default class CoreHelp extends SucklessMod {
	constructor() {
		super({
			name: "Ticket Manager",
			author: "acayrin",
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
			command: "ticket",
			aliases: ["t"],
			description: "Ticket management command",
			usage: "%prefix%<command/alias> [args]",
			priority: 10,
			single: true,
			events: {
				onMsgCreate: ticketCheck,
			},
		});
	}
}

const ticketCheck = async (msg: Message | PartialMessage, args: string[], bot: SucklessBot) => {
	// ignore bot
	if (msg.author.bot || msg.deleted) return;

	// generate a ticket id
	const tid = id();

	// convert to json object in order to get channel name
	const json: any = msg.channel.toJSON();
	const category: CategoryChannel | any = await msg.guild.channels.fetch(json["parentId"]);
	let channel: GuildChannel = undefined;

	// check if its a ticket channel
	if (args?.indexOf("close") > -1) {
		if (json["name"].startsWith("ticket-")) {
			if (
				bot.configs.get("ticket.json")["staff_roles"].indexOf(msg.member.roles.highest.id) > -1 ||
				msg.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
			)
				return msg.channel.delete();
		}
	} else {
		// only available in fixed channel
		if (msg.channel.id !== bot.configs.get("ticket.json")["ticket_channel"]) return;

		// parse arguments and check for validity
		const s = msg.content.split("\n");
		const r = {
			a: s[0],
			b: s[1],
			c: s[2],
			d: s[3],
		};
		s.splice(0, 3);
		r.d = s.join("\n");

		// shortcut
		const d = (text: string) =>
			msg
				.delete()
				.finally(() =>
					msg.channel.send(`${msg.member} - ${text}`).then((m) => setTimeout(() => m.delete(), 5000))
				);

		if (bot.configs.get("ticket.json")["ticket_types"].indexOf(r.a.toLowerCase()) < 0)
			return d(
				"Invalid ticket type. Possible values: " + bot.configs.get("ticket.json")["ticket_types"].join(", ")
			);
		if (!r.b) return d("Missing date!");
		else if (!r.c) return d("Missing server!");
		else if (!r.d) return d("Missing description!");
		else if (msg.attachments.size < 1) return d("Missing attachments!");
		// EOL

		// create ticket channel
		try {
			channel = await category.createChannel(`Ticket-${tid}`);
			if (channel.isText())
				channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(bot.configs.get("core.json")["color"])
							.setTitle(r.a.toUpperCase())
							.setDescription(`**Date**: ${r.b}\n**Server**: ${r.c}\n\n${r.d}`)
							.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL()),
					],
					files: Array.from(msg.attachments.values()),
				});
		} catch (e) {
			bot.emit("debug", `[Ticket ${tid}] Unable to create channel: ${e}`);
		}

		// permission overrides
		channel.permissionOverwrites.create(msg.author, {
			VIEW_CHANNEL: true,
			SEND_MESSAGES: true,
			READ_MESSAGE_HISTORY: true,
		});

		bot.configs.get("ticket.json")["staff_roles"].forEach(async (id: string) => {
			const role = await msg.guild.roles.fetch(id);
			if (role)
				channel.permissionOverwrites.create(role, {
					VIEW_CHANNEL: true,
					SEND_MESSAGES: true,
					READ_MESSAGE_HISTORY: true,
				});
			else null; //bot.emit("debug", `[Ticket ${tid}] Unable to find matching role for ID: ${id}`);
		});

		// delete
		return msg.delete();
	}
};
