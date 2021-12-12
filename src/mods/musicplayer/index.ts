import * as Discord from "discord.js";
import { SucklessBot } from "../../core/sucklessbot";
import { MusicManager, MusicPlayer, MusicTrack } from "./class/";
import * as func from "./functions";
import { help, MusicPlayerLang } from "./lang";

let musicMgr: MusicManager;
export async function CreatePlayer(message: Discord.Message, args: string[], bot: SucklessBot) {
	if (!args) return;
	const check = (): MusicPlayer => {
		musicMgr ||= new MusicManager(bot);

		const voice = message.member.voice.channel;
		if (!voice) {
			message.reply(MusicPlayerLang.ERR_PLAYER_NO_VOICE);
			return null;
		}

		// add new music player instance
		const player =
			musicMgr.getSession().find((player) => player.getGuild().id.includes(message.guildId)) ||
			new MusicPlayer(message.channel, voice, musicMgr, bot);
		if (!musicMgr.getSession().includes(player)) musicMgr.add(player);
		return player;
	};

	// get sub command
	const subcmd = args.shift();
	switch (subcmd) {
		// play subcommand
		case "search":
		case "play":
		case "p": {
			// no input
			if (args.length < 1) return message.reply(MusicPlayerLang.ERR_SEARCH_NO_INPUT);
			const player = check();

			// if input is a valid video url
			if (func.vVideo(args.join())) {
				try {
					const vid = await func.parseVideo(args.join(), message.member);
					message.reply(MusicPlayerLang.PLAYER_TRACK_ADDED.replace(/%track%+/g, vid.name));
					player.addTrack(vid);
					if (!player.isPlaying()) player.play();
				} catch (e) {
					message.reply(MusicPlayerLang.ERR_SEARCH_NO_RESULT.replace(/%error%+/g, e.message));
				}

				// if input is a valid playlist url
			} else if (func.vPlaylist(args.join())) {
				try {
					const vids = await func.parsePlaylist(args.join(), message.member);
					message.reply(MusicPlayerLang.PLAYER_PLAYLIST_ADDED.replace(/%tracks%+/g, vids.length.toString()));
					player.addTrack(vids);
					if (!player.isPlaying()) player.play();
				} catch (e) {
					message.reply(MusicPlayerLang.ERR_SEARCH_NO_RESULT.replace(/%error%+/g, e.message));
				}

				// query input
			} else {
				const vid = (await func.search(args.join(" "), message.member)).shift();
				message.reply(MusicPlayerLang.PLAYER_TRACK_ADDED.replace(/%track%+/g, vid.name));
				player.addTrack(vid);
				if (!player.isPlaying()) player.play();
			}
			break;
		}

		// search subcommand
		case "search":
		case "s": {
			const player = check();
			const tmp = new Map<number, MusicTrack>();
			const res = await func.search(args.join(" "), message.member);
			let msg: string[] = [MusicPlayerLang.PLAYER_SEARCH_HEADER];
			for (let i = 0, j = res.length; i < j; i++) {
				tmp.set(i, res[i]);
				msg.push(
					MusicPlayerLang.PLAYER_SEARCH_EACH.replace(/%index%+/g, i.toString())
						.replace(/%track_name%+/g, res[i].name)
						.replace(/%track_channel%+/g, res[i].channel)
						.replace(/%track_duration%+/g, func.timeFormat(res[i].duration))
				);
			}
			msg.push(MusicPlayerLang.PLAYER_SEARCH_FOOTER);

			// reply with the results
			message.reply(msg.join("\n")).then(() => {
				// wait for user's input
				message.channel
					.awaitMessages({
						filter: (m: Discord.Message) => m.author.id === message.author.id,
						max: 1,
						time: 30e3,
					})
					.then((messages) => {
						// select an index and add the related track
						const index = Number(messages.first().content);
						if (/^-?\d+$/.test(`${index}`) && index > -1 && index < res.length) {
							message.reply(MusicPlayerLang.PLAYER_TRACK_ADDED.replace(/%track%+/g, tmp.get(index).name));
							player.addTrack(tmp.get(index));
							if (!player.isPlaying()) player.play();
						} else {
							// ignore user input if it isn't valid
						}
					})
					.catch(() => {
						// no choice
						message.reply(MusicPlayerLang.PLAYER_SEARCH_TIMEOUT);
					});
			});
			break;
		}

		// show current track info
		case "now":
		case "n": {
			const player = check();
			const now = player.current;
			const progress: string[] = [];
			for (let i = 0; i < 50; i++)
				progress.push(
					Math.floor(((now?.playbackDuration || 0) / 1000 / (now?.metadata.duration || 0)) * 50) === i
						? "🤡"
						: "─"
				);
			message.reply(
				MusicPlayerLang.PLAYER_NOW_FORMAT.replace(/%track_name%+/g, now?.metadata.name)
					.replace(/%track_requester%+/g, now?.metadata.requester.user.tag)
					.replace(/%track_bar%+/g, progress.join(""))
					.replace(/%track_now%+/g, func.timeFormat((now?.playbackDuration || 0) / 1000))
					.replace(/%track_duration%+/g, func.timeFormat(now?.metadata.duration))
					.replace(/%filter%+/g, player.filter)
			);
			break;
		}

		// remove one or more tracks from the queue
		case "remove":
		case "rm": {
			// no input
			if (args.length < 1) return message.reply(MusicPlayerLang.PLAYER_REMOVE_NO_INPUT);
			const player = check();

			const msg: string[] = [MusicPlayerLang.PLAYER_REMOVE_HEADER];
			args.forEach((input) => {
				if (!Number(input)) return;
				const track = player.removeTrack(Number(input));
				msg.push(
					MusicPlayerLang.PLAYER_REMOVE_EACH.replace(/%track_name%+/g, track.name).replace(
						/%track_requester%+/g,
						track.requester.user.tag
					)
				);
			});
			msg.push(MusicPlayerLang.PLAYER_REMOVE_FOOTER);

			message.reply(msg.join("\n"));
			break;
		}

		// list current tracks in queue
		case "playlist":
		case "list":
		case "ls": {
			const player = check();
			const queue = player.getQueue();
			const get = Number(args[0]) || 1;
			const page = queue.length > 10 && queue.length - get * 10 < 0 ? 1 : get;
			const msg: string[] = [
				MusicPlayerLang.PLAYER_LIST_HEADER.replace(/%page_current%+/g, page.toString()).replace(
					/%page_all%+/g,
					Math.floor(queue.length / 10).toString()
				),
			];
			const i1 = page * 10 > queue.length ? queue.length : page * 10;
			const i2 = (page - 1) * 10;
			for (let i = i2; i < i1; i++)
				msg.push(
					MusicPlayerLang.PLAYER_LIST_EACH.replace(/%index%+/g, i.toString())
						.replace(/%track_name%+/g, queue[i].name)
						.replace(/%track_channel%+/g, queue[i].channel)
						.replace(/%track_requester%+/g, queue[i].requester.user.tag)
						.replace(/%track_duration%+/g, func.timeFormat(queue[i].duration))
						.replace(/%filter%+/g, player.filter)
				);
			msg.push(MusicPlayerLang.PLAYER_LIST_FOOTER);
			message.reply(msg.join("\n"));
			break;
		}

		// apply filter
		case "filter":
		case "af": {
			if (args.length < 1) {
				check()?.applyfilter("none");
			} else {
				check()?.applyfilter(args.join(""));
			}
		}

		// force skip current track
		case "skip":
		case "fs": {
			check()?.skip();
			break;
		}

		// pause/resume the player
		case "resume":
		case "pause":
		case "pr": {
			check()?.togglePauseResume();
			break;
		}

		// dickmove/disconnect the bot
		case "disconnect":
		case "dickmove":
		case "stop":
		case "dc": {
			check()?.disconnect();
			break;
		}

		default: {
			message.channel.send({
				embeds: [help(bot)],
			});
		}
	}
}
