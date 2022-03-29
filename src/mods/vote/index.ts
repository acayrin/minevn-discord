import { Message } from "discord.js";
import { SucklessBot } from "../../core/SucklessBot";
import { getRole, getUser } from "../../core/utils";
import { VoteManager, VoteMute, VoteUnmute } from "./class/";
import * as recentmutes from "./RecentMute";

// vote manager
export const voteMgr: VoteManager = new VoteManager();

/**
 * Vote (un)mute someone cuz i love democracy
 *
 * @param {Message} message
 * @param {string[]} args
 * @param {SucklessBot} bot
 * @param {boolean} unmute
 */
async function VoteSomebody(message: Message, args: string[], bot: SucklessBot, unmute?: boolean) {
	if (!args) return;

	// channel lock
	if (bot.configs.get("vote.json")["channel"])
		if (!bot.configs.get("vote.json")["channel"].includes(message.channelId)) {
			const channel = message.guild.channels.cache
				.filter((ch) => bot.configs.get("vote.json")["channel"].includes(ch.id))
				.first();
			return message.reply(`Buddy, ya can't vote someone outside of ${channel}`);
		}

	const lookup = args.shift();
	const reason = args.join(" ").length > 0 ? args.join(" ") : undefined;

	// user check
	let user = message.mentions.members.first();
	if (!user && lookup) user = await getUser(lookup, message.guild);

	// if user doesn't exist
	if (!user) {
		return message.channel.send(`Looking for a ghost? Try that again but be sure to mention someone`);
	}

	// if user is a bot
	if (user.user.bot) {
		return message.channel.send(`**${user.user.tag}** is a robot u sussy baka`);
	}

	// check if a vote is ongoing
	const session = voteMgr.getSession().find((session) => session.target.id.includes(user.id));
	if (session) {
		return (session.msg || message).reply(`There is an ongoing vote for **${user.user.tag}** so stopping now`);
	}

	// try to get muted role
	const role = await getRole(bot.configs.get("vote.json")["role"] || "mute", message.member.guild);

	// check if role exists
	if (!role) {
		return message.channel.send(`Can't find any **muted** role, stop abusing now`);
	}

	// vote unmute
	if (unmute) {
		if (user.roles.cache.has(role.id)) {
			return new VoteUnmute(user, message.member, message.channel, bot, {
				reason: reason || undefined,
				timer: bot.configs.get("vote.json")["timer"],
			}).vote();
		} else {
			return message.channel.send(`User **${user.user.tag}** is not muted so ignoring`);
		}
	}

	// if user is recent muted
	if (recentmutes.has(user.id)) {
		return message.channel.send(`User **${user.user.tag}** was recently abused, please refrain yourself`);
	}

	// check if user is already muted by another source
	if (user.roles.cache.has(role.id)) {
		return message.channel.send(`User **${user.user.tag}** is already muted, give them a break will ya`);
	}

	// check if user is higher ranked
	if (user.roles.highest.comparePositionTo(role) > 0) {
		return message.channel.send(`User **${user.user.tag}** is too powerful, can't abuse them`);
	}

	// vote mute
	new VoteMute(user, message.member, message.channel, bot, {
		reason: reason || undefined,
		timer: bot.configs.get("vote.json")["timer"],
	}).vote();
}

/**
 * Vote mute somebody
 *
 * @param {Message} message
 * @param {string[]} args
 * @param {SucklessBot} bot
 */
export async function VM(message: Message, args: string[], bot: SucklessBot) {
	await VoteSomebody(message, args, bot);
}

/**
 * Vote un-mute somebody
 *
 * @param {Message} message
 * @param {string[]} args
 * @param {SucklessBot} bot
 */
export async function VUM(message: Message, args: string[], bot: SucklessBot) {
	await VoteSomebody(message, args, bot, true);
}
