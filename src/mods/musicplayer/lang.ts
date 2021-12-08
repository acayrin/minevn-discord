export enum MusicPlayerLang {
	ERR_SEARCH_NO_INPUT = "I can't search for nothing, try again but type something",
	ERR_SEARCH_NO_RESULT = "Something went wrong, please try again (Err: %error%)",

	ERR_PLAYER_NO_VOICE = "You're not connected to any voice channel, please join one then try again",
	ERR_PLAYER_UNKNOWN = "Player encountered an unkwon error (Err: %error%)",

	ERR_TRACK_AGE_RESTRICTED = "Skipped current track due to age restriction",
	ERR_TRACK_RATE_LIMITED = "Being rate-limited by Youtube, retrying...",
	ERR_TRACK_NO_OPUS = "Skipped current track due to no suitable audio was found",
	ERR_TRACK_UNKNOWN = "Skipped current track due to an unknown error (Err: %error%)",

	PLAYER_DESTROYED = "Destroyed voice session",
	PLAYER_RESUMED = "Resumed the audio player",
	PLAYER_PAUSED = "Paused the audio player",
	PLAYER_FINISHED = "Finished playing **%track_name%** (%track_requester%)",
	PLAYER_STARTED = "Started playing **%track_name%** (%track_requester%)",

	PLAYER_TRACK_ADDED = "Added **%track%** to the queue",
	PLAYER_TRACK_REMOVED = "Removed **%track%** from the queue",

	PLAYER_PLAYLIST_ADDED = "Added **%tracks%** tracks to the queue",

	PLAYER_NOW_FORMAT = "```%track_name% (%track_requester%)\n%track_bar% [%track_now%/%track_duration%]```",

	PLAYER_LIST_HEADER = "```Current queue (%page_current%/%page_all%)\n",
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
