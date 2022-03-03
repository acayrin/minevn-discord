"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.help = exports.MusicPlayerLang = void 0;
var Discord = __importStar(require("discord.js"));
var filters_1 = require("./filters");
var MusicPlayerLang;
(function (MusicPlayerLang) {
    MusicPlayerLang["ERR_SEARCH_NO_INPUT"] = "I can't search for nothing, try again but type something";
    MusicPlayerLang["ERR_SEARCH_NO_RESULT"] = "Something went wrong, please try again (Err: %error%)";
    MusicPlayerLang["ERR_PLAYER_NO_VOICE"] = "You're not connected to any voice channel, please join one then try again";
    MusicPlayerLang["ERR_PLAYER_UNKNOWN"] = "Player encountered an unkwon error (Err: %error%)";
    MusicPlayerLang["ERR_TRACK_AGE_RESTRICTED"] = "Skipped current track due to age restriction";
    MusicPlayerLang["ERR_TRACK_RATE_LIMITED"] = "Being rate-limited by Youtube, retrying...";
    MusicPlayerLang["ERR_TRACK_NO_OPUS"] = "Skipped current track due to no suitable audio was found";
    MusicPlayerLang["ERR_TRACK_UNKNOWN"] = "Skipped current track due to an unknown error (Err: %error%)";
    MusicPlayerLang["PLAYER_DESTROYED"] = "Party's over, see y'all later";
    MusicPlayerLang["PLAYER_ADY_DESTROYED"] = "Player's already destroyed or doesn't exist";
    MusicPlayerLang["PLAYER_RESUMED"] = "Resumed the audio player";
    MusicPlayerLang["PLAYER_PAUSED"] = "Paused the audio player";
    MusicPlayerLang["PLAYER_FINISHED"] = "Finished playing **%track_name%** (%track_requester%)";
    MusicPlayerLang["PLAYER_QUEUE_ENDED"] = "Finished playing all tracks";
    MusicPlayerLang["PLAYER_STARTED"] = "Started playing **%track_name%** (%track_requester%)";
    MusicPlayerLang["PLAYER_TRACK_ADDED"] = "Added **%track%** to the queue";
    MusicPlayerLang["PLAYER_TRACK_REMOVED"] = "Removed **%track%** from the queue";
    MusicPlayerLang["PLAYER_TRACK_RESUMED"] = "Resuming **%track_name%** at **%track_duration%**";
    MusicPlayerLang["PLAYER_FILTER_SET"] = "Set filter **%filter%** for current player, please hold";
    MusicPlayerLang["PLAYER_FILTER_RESET"] = "Removed filter from current player, please hold";
    MusicPlayerLang["PLAYER_LOOP_SET"] = "Set player's loop mode to **%loop%**";
    MusicPlayerLang["PLAYER_PLAYLIST_ADDED"] = "Added **%tracks%** tracks to the queue";
    MusicPlayerLang["PLAYER_NOW_FORMAT"] = "```%track_name% (%track_requester%)\n[\uD83C\uDFB6] [%filter% - %loop%] [%track_bar%] [%track_now%/%track_duration%]```";
    MusicPlayerLang["PLAYER_LIST_HEADER"] = "```Current queue (%page_current%/%page_all%) [F: %filter%] [L: %loop%]\n";
    MusicPlayerLang["PLAYER_LIST_EACH"] = "[%index%] %track_name%\n \u2514\u2500 %track_requester% - %track_duration%";
    MusicPlayerLang["PLAYER_LIST_FOOTER"] = "\nTo switch between pages, use 'yt list [page]' ```";
    MusicPlayerLang["PLAYER_SEARCH_TIMEOUT"] = "Well you didn't choose anything";
    MusicPlayerLang["PLAYER_SEARCH_HEADER"] = "```Select a song by typing its number";
    MusicPlayerLang["PLAYER_SEARCH_EACH"] = "[%index%] %track_name%\n \u2514\u2500 %track_channel% - %track_duration%";
    MusicPlayerLang["PLAYER_SEARCH_FOOTER"] = "```";
    MusicPlayerLang["PLAYER_REMOVE_NO_INPUT"] = "I can't remove nothing, try again but type something, like 1 2 3";
    MusicPlayerLang["PLAYER_REMOVE_HEADER"] = "```Removed tracks:";
    MusicPlayerLang["PLAYER_REMOVE_EACH"] = "[-] %track_name% (%track_requester%)";
    MusicPlayerLang["PLAYER_REMOVE_FOOTER"] = "```";
})(MusicPlayerLang = exports.MusicPlayerLang || (exports.MusicPlayerLang = {}));
var help = function (bot) {
    return new Discord.MessageEmbed()
        .setTitle("Music player")
        .setDescription("A music player since Susan decided to kill off most of the bots, also this thing spams alot\n" +
        "Note: **THE BOT CAN ONLY BE DISCONNECTED BY ``yt dc`` SUBCOMMAND**\n" +
        "Subcommands below")
        .setColor(bot.configs.get("core.json")["color"])
        .setThumbnail(bot.cli().user.avatarURL())
        .addField("yt play/p [query]", "Search and play a track, can be a video or playlist url")
        .addField("yt search/s [query]", "Search for a track")
        .addField("yt skip/fs", "Skip current track (if somebody decided to put an earrape")
        .addField("yt filter/af [name]", "Apply an audio filter to current player")
        .addField("Available filters", "``".concat(Object.keys(filters_1.AudioFilter).join().replace("this", ""), "``"))
        .addField("yt loop/lp [number]", "Apply loop mode to current player")
        .addField("Loop modes", "0 - none, 1 - current, 2 - queue")
        .addField("yt now/n", "Show current track info")
        .addField("yt remove/rm [index(es)]", "Remove tracks from playlist, can be multiple, separated by spaces")
        .addField("yt list/ls", "List all tracks in current queue")
        .addField("yt stop/dc", "Destroy your music session and ruin your day");
};
exports.help = help;
