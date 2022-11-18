/* eslint-disable no-mixed-spaces-and-tabs */
import Eris from 'eris';

import Yujin from '../../../core/yujin';
import { VoteManager, VoteMute, VoteUnmute } from './class';

// vote manager
export const voteMgr: VoteManager = new VoteManager();

export async function VoteSomebody(
	m: Eris.Message | Eris.CommandInteraction,
	opt: {
		bot?: Yujin.Bot;
		mod?: Yujin.Mod;
		args?: string[] | Eris.InteractionDataOptions[];
		command?: string;
	},
	unmute?: boolean,
) {
	if (!opt.args) return;

	const vars = {
		target: m
			.guild()
			.getUser(
				m instanceof Eris.Message
					? m.mentions.shift()?.id || (opt.args.shift() as string)
					: ((
							(opt.args as Eris.InteractionDataOptions[]).find(
								(z) => z.name === 'user',
							) as Eris.InteractionDataOptionWithValue
					  )?.value as string) || undefined,
			),
		reason:
			opt.args.length > 0
				? opt.args instanceof Array<string>
					? opt.args.join(' ')
					: ((opt.args as Eris.InteractionDataOptionsWithValue[]).find((z) => z.name === 'reason')
							?.value as string)
				: undefined,
		role: m.guild().getRole(opt.mod.getConfig().muted_role || 'mute'),
	};

	// mention check
	if (!vars.target && opt.args.length < 1) {
		return this.printInvalidUsage(m, opt.mod.bot);
	}

	// channel lock
	if (opt.mod.getConfig().channel)
		if (!opt.mod.getConfig().channel.includes(m.channel.id)) {
			const channel = opt.mod.bot.client.getGuild(m.guildID)?.getChannel(opt.mod.getConfig().channel);
			return m.reply({
				content: `Buddy ${m.member.mention}, ya can't vote someone outside of ${channel?.mention}`,
			});
		}

	// check if role exists
	if (!vars.role) {
		return m.reply("Can't find any **muted** role, stop abusing now");
	}

	// if user doesn't exist
	if (!vars.target) {
		return m.reply({
			content: 'Looking for a ghost? Try that again but be sure to mention someone',
		});
	}

	// if user is a bot
	if (vars.target.bot) {
		return m.reply({
			content: `**${vars.target.tag()}** is a robot u sussy baka`,
		});
	}

	// ====================================== VOTE UNMUTE ======================================
	// check if a vote is ongoing
	const session = voteMgr.getSession().find((session) => session.target.id.includes(vars.target.id));
	if (session) {
		return (session.msg || m).reply({
			content: `There is an ongoing vote for **${vars.target.tag()}** so stopping now`,
		});
	}

	// vote unmute
	if (unmute) {
		return vars.target.getRole(vars.role.id)
			? new VoteUnmute({
					target: vars.target,
					owner: m.member,
					channel: m.channel,
					mod: opt.mod,
					reason: vars.reason,
					timer: opt.mod.getConfig()['timer'],
			  }).vote()
			: m.reply({
					content: `User **${vars.target.tag()}** is not muted so ignoring`,
			  });
	}

	// ======================================= VOTE MUTE =======================================
	// check if user has skipped roles (any)
	if (opt.mod.getConfig().ignored_roles?.length > 0) {
		for (const role of opt.mod.getConfig().ignored_roles) {
			if (vars.target.roles.indexOf(role) !== -1)
				return m.reply({
					content: `You can't vote **${vars.target.tag()}** cuz they have the anti-vote pass`,
				});
		}
	}

	// if user is recent muted
	if (opt.mod.getDatastore().get(vars.target.id, m.guildID)) {
		return m.reply({
			content: `User **${vars.target.tag()}** was recently abused, please refrain yourself`,
		});
	}

	// check if user is already muted by another source
	if (vars.target.getRole(vars.role.id)) {
		return m.reply({
			content: `User **${vars.target.tag()}** is already muted, give them a break will ya`,
		});
	}

	// check if user is higher ranked
	if (m.member.getHighestRole().compareTo(vars.target.getHighestRole()) < 0) {
		return m.reply({
			content: `User **${vars.target.tag()}** is too powerful, can't abuse them`,
		});
	}

	// vote mute
	new VoteMute({
		target: vars.target,
		owner: m.member,
		channel: m.channel,
		mod: opt.mod,
		reason: vars.reason,
		timer: opt.mod.getConfig().timer || 30,
	}).vote();
}
