import { SucklessBot } from "../../core/sucklessbot";
import * as Discord from "discord.js";
import { AudioFilter } from "./filters";

export enum MusicPlayerLang {
	ERR_SEARCH_NO_INPUT = "I can't search for nothing, try again but type something",
	ERR_SEARCH_NO_RESULT = "Something went wrong, please try again (Err: %error%)",

	ERR_PLAYER_NO_VOICE = "You're not connected to any voice channel, please join one then try again",
	ERR_PLAYER_UNKNOWN = "Player encountered an unkwon error (Err: %error%)",

	ERR_TRACK_AGE_RESTRICTED = "Skipped current track due to age restriction",
	ERR_TRACK_RATE_LIMITED = "Being rate-limited by Youtube, retrying...",
	ERR_TRACK_NO_OPUS = "Skipped current track due to no suitable audio was found",
	ERR_TRACK_UNKNOWN = "Skipped current track due to an unknown error (Err: %error%)",

	PLAYER_DESTROYED = "Party's over, see y'all later",
	PLAYER_ADY_DESTROYED = "Player's already destroyed or doesn't exist",
	PLAYER_RESUMED = "Resumed the audio player",
	PLAYER_PAUSED = "Paused the audio player",
	PLAYER_FINISHED = "Finished playing **%track_name%** (%track_requester%)",
	PLAYER_QUEUE_ENDED = "Finished playing all tracks",
	PLAYER_STARTED = "Started playing **%track_name%** (%track_requester%)",
	PLAYER_TRACK_ADDED = "Added **%track%** to the queue",
	PLAYER_TRACK_REMOVED = "Removed **%track%** from the queue",
	PLAYER_TRACK_RESUMED = "Resuming **%track_name%** at **%track_duration%**",

	PLAYER_FILTER_SET = "Set filter **%filter%** for current player, please hold",
	PLAYER_FILTER_RESET = "Removed filter from current player, please hold",

	PLAYER_LOOP_SET = "Set player's loop mode to **%loop%**",

	PLAYER_PLAYLIST_ADDED = "Added **%tracks%** tracks to the queue",

	PLAYER_NOW_FORMAT = "```%track_name% (%track_requester%)\n[🎶] [%filter% - %loop%] [%track_bar%] [%track_now%/%track_duration%]```",

	PLAYER_LIST_HEADER = "```Current queue (%page_current%/%page_all%) [F: %filter%] [L: %loop%]\n",
	PLAYER_LIST_EACH = "[%index%] %track_name%\n └─ %track_requester% - %track_duration%",
	PLAYER_LIST_FOOTER = "\nTo switch between pages, use 'yt list [page]' ```",

	PLAYER_SEARCH_TIMEOUT = "Well you didn't choose anything",
	PLAYER_SEARCH_HEADER = "```Select a song by typing its number",
	PLAYER_SEARCH_EACH = "[%index%] %track_name%\n └─ %track_channel% - %track_duration%",
	PLAYER_SEARCH_FOOTER = "```",

	PLAYER_REMOVE_NO_INPUT = "I can't remove nothing, try again but type something, like 1 2 3",
	PLAYER_REMOVE_HEADER = "```Removed tracks:",
	PLAYER_REMOVE_EACH = "[-] %track_name% (%track_requester%)",
	PLAYER_REMOVE_FOOTER = "```",
}

export const help = (bot: SucklessBot) =>
	new Discord.MessageEmbed()
		.setTitle("Music player")
		.setDescription(
			"A music player since Susan decided to kill off most of the bots, also this thing spams alot\n" +
				"Note: **THE BOT CAN ONLY BE DISCONNECTED BY ``yt dc`` SUBCOMMAND**\n" +
				"Subcommands below"
		)
		.setColor(bot.configs.get("core.json")["color"])
		.setThumbnail(bot.cli().user.avatarURL())
		.addField("yt play/p [query]", "Search and play a track, can be a video or playlist url")
		.addField("yt search/s [query]", "Search for a track")
		.addField("yt skip/fs", "Skip current track (if somebody decided to put an earrape")
		.addField("yt filter/af [name]", "Apply an audio filter to current player")
		.addField("Available filters", `\`\`${Object.keys(AudioFilter).join().replace("this", "")}\`\``)
		.addField("yt loop/lp [number]", "Apply loop mode to current player")
		.addField("Loop modes", "0 - none, 1 - current, 2 - queue")
		.addField("yt now/n", "Show current track info")
		.addField("yt remove/rm [index(es)]", "Remove tracks from playlist, can be multiple, separated by spaces")
		.addField("yt list/ls", "List all tracks in current queue")
		.addField("yt stop/dc", "Destroy your music session and ruin your day");
