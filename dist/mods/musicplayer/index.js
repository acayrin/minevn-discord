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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CreatePlayer = void 0;
var Discord = __importStar(require("discord.js"));
var musicmanager_1 = require("./class/musicmanager");
var musicplayer_1 = require("./class/musicplayer");
var func = __importStar(require("./functions"));
var lang_1 = require("./lang");
var musicMgr;
function CreatePlayer(message, args, bot) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var check, subcmd, _d, player, vid, e_1, vids, e_2, vid, player_1, tmp_1, res_1, msg, i, j, player, now, progress, i, player_2, msg_1, player, queue, get, page, msg, i1, i2, i;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!args)
                        return [2];
                    check = function () {
                        musicMgr || (musicMgr = new musicmanager_1.MusicManager(bot));
                        var voice = message.member.voice.channel;
                        if (!voice) {
                            message.reply(lang_1.MusicPlayerLang.ERR_PLAYER_NO_VOICE);
                            return null;
                        }
                        var player = musicMgr.getSession().find(function (player) { return player.getGuild().id.includes(message.guildId); }) ||
                            new musicplayer_1.MusicPlayer(message.channel, voice, musicMgr, bot);
                        if (!musicMgr.getSession().includes(player))
                            musicMgr.add(player);
                        return player;
                    };
                    subcmd = args.shift();
                    _d = subcmd;
                    switch (_d) {
                        case "search": return [3, 1];
                        case "play": return [3, 1];
                        case "p": return [3, 1];
                        case "search": return [3, 14];
                        case "s": return [3, 14];
                        case "now": return [3, 16];
                        case "n": return [3, 16];
                        case "remove": return [3, 17];
                        case "rm": return [3, 17];
                        case "skip": return [3, 18];
                        case "fs": return [3, 18];
                        case "resume": return [3, 19];
                        case "pause": return [3, 19];
                        case "pr": return [3, 19];
                        case "playlist": return [3, 20];
                        case "list": return [3, 20];
                        case "ls": return [3, 20];
                        case "disconnect": return [3, 21];
                        case "dickmove": return [3, 21];
                        case "stop": return [3, 21];
                        case "dc": return [3, 21];
                    }
                    return [3, 22];
                case 1:
                    if (args.length < 1)
                        return [2, message.reply(lang_1.MusicPlayerLang.ERR_SEARCH_NO_INPUT)];
                    player = check();
                    if (!func.vVideo(args.join())) return [3, 6];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    return [4, func.parseVideo(args.join(), message.member)];
                case 3:
                    vid = _e.sent();
                    message.reply(lang_1.MusicPlayerLang.PLAYER_TRACK_ADDED.replace(/%track%+/g, vid.name));
                    player.addTrack(vid);
                    if (!player.isPlaying())
                        player.play();
                    return [3, 5];
                case 4:
                    e_1 = _e.sent();
                    message.reply(lang_1.MusicPlayerLang.ERR_SEARCH_NO_RESULT.replace(/%error%+/g, e_1.message));
                    return [3, 5];
                case 5: return [3, 13];
                case 6:
                    if (!func.vPlaylist(args.join())) return [3, 11];
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 9, , 10]);
                    return [4, func.parsePlaylist(args.join(), message.member)];
                case 8:
                    vids = _e.sent();
                    message.reply(lang_1.MusicPlayerLang.PLAYER_PLAYLIST_ADDED.replace(/%tracks%+/g, vids.length.toString()));
                    player.addTrack(vids);
                    if (!player.isPlaying())
                        player.play();
                    return [3, 10];
                case 9:
                    e_2 = _e.sent();
                    message.reply(lang_1.MusicPlayerLang.ERR_SEARCH_NO_RESULT.replace(/%error%+/g, e_2.message));
                    return [3, 10];
                case 10: return [3, 13];
                case 11: return [4, func.search(args.join(" "), message.member)];
                case 12:
                    vid = (_e.sent()).shift();
                    message.reply(lang_1.MusicPlayerLang.PLAYER_TRACK_ADDED.replace(/%track%+/g, vid.name));
                    player.addTrack(vid);
                    if (!player.isPlaying())
                        player.play();
                    _e.label = 13;
                case 13: return [3, 23];
                case 14:
                    player_1 = check();
                    tmp_1 = new Map();
                    return [4, func.search(args.join(" "), message.member)];
                case 15:
                    res_1 = _e.sent();
                    msg = [lang_1.MusicPlayerLang.PLAYER_SEARCH_HEADER];
                    for (i = 0, j = res_1.length; i < j; i++) {
                        tmp_1.set(i, res_1[i]);
                        msg.push(lang_1.MusicPlayerLang.PLAYER_SEARCH_EACH.replace(/%index%+/g, i.toString())
                            .replace(/%track_name%+/g, res_1[i].name)
                            .replace(/%track_channel%+/g, res_1[i].channel)
                            .replace(/%track_duration%+/g, func.timeFormat(res_1[i].duration)));
                    }
                    msg.push(lang_1.MusicPlayerLang.PLAYER_SEARCH_FOOTER);
                    message.reply(msg.join("\n")).then(function () {
                        message.channel
                            .awaitMessages({
                            filter: function (m) { return m.author.id === message.author.id; },
                            max: 1,
                            time: 30e3
                        })
                            .then(function (messages) {
                            var index = Number(messages.first().content);
                            if (/^-?\d+$/.test("".concat(index)) && index > -1 && index < res_1.length) {
                                message.reply(lang_1.MusicPlayerLang.PLAYER_TRACK_ADDED.replace(/%track%+/g, tmp_1.get(index).name));
                                player_1.addTrack(tmp_1.get(index));
                                if (!player_1.isPlaying())
                                    player_1.play();
                            }
                            else {
                            }
                        })["catch"](function () {
                            message.reply(lang_1.MusicPlayerLang.PLAYER_SEARCH_TIMEOUT);
                        });
                    });
                    return [3, 23];
                case 16:
                    {
                        player = check();
                        now = player.current;
                        progress = [];
                        for (i = 0; i < 50; i++)
                            progress.push(Math.floor((now.playbackDuration / 1000 / now.metadata.duration) * 50) === i ? "🤡" : "─");
                        message.reply(lang_1.MusicPlayerLang.PLAYER_NOW_FORMAT.replace(/%track_name%+/g, now.metadata.name)
                            .replace(/%track_requester%+/g, now.metadata.author.user.tag)
                            .replace(/%track_bar%+/g, progress.join(""))
                            .replace(/%track_now%+/g, func.timeFormat(now.playbackDuration / 1000))
                            .replace(/%track_duration%+/g, func.timeFormat(now.metadata.duration)));
                        return [3, 23];
                    }
                    _e.label = 17;
                case 17:
                    {
                        if (args.length < 1)
                            return [2, message.reply(lang_1.MusicPlayerLang.PLAYER_REMOVE_NO_INPUT)];
                        player_2 = check();
                        msg_1 = [lang_1.MusicPlayerLang.PLAYER_REMOVE_HEADER];
                        args.forEach(function (input) {
                            if (!Number(input))
                                return;
                            var track = player_2.removeTrack(Number(input));
                            msg_1.push(lang_1.MusicPlayerLang.PLAYER_REMOVE_EACH.replace(/%track_name%+/g, track.name).replace(/%track_requester%+/g, track.author.user.tag));
                        });
                        msg_1.push(lang_1.MusicPlayerLang.PLAYER_REMOVE_FOOTER);
                        message.reply(msg_1.join("\n"));
                        return [3, 23];
                    }
                    _e.label = 18;
                case 18:
                    {
                        (_a = check()) === null || _a === void 0 ? void 0 : _a.skip();
                        return [3, 23];
                    }
                    _e.label = 19;
                case 19:
                    {
                        (_b = check()) === null || _b === void 0 ? void 0 : _b.togglePauseResume();
                        return [3, 23];
                    }
                    _e.label = 20;
                case 20:
                    {
                        player = check();
                        queue = player.getQueue();
                        get = Number(args[0]) || 1;
                        page = queue.length > 10 && queue.length - get * 10 < 0 ? 1 : get;
                        msg = [
                            lang_1.MusicPlayerLang.PLAYER_LIST_HEADER.replace(/%page_current%+/g, page.toString()).replace(/%page_all%+/g, Math.floor(queue.length / 10).toString()),
                        ];
                        i1 = page * 10 > queue.length ? queue.length : page * 10;
                        i2 = (page - 1) * 10;
                        for (i = i2; i < i1; i++)
                            msg.push(lang_1.MusicPlayerLang.PLAYER_LIST_EACH.replace(/%index%+/g, i.toString())
                                .replace(/%track_name%+/g, queue[i].name)
                                .replace(/%track_channel%+/g, queue[i].channel)
                                .replace(/%track_requester%+/g, queue[i].author.user.tag)
                                .replace(/%track_duration%+/g, func.timeFormat(queue[i].duration)));
                        msg.push(lang_1.MusicPlayerLang.PLAYER_LIST_FOOTER);
                        message.reply(msg.join("\n"));
                        return [3, 23];
                    }
                    _e.label = 21;
                case 21:
                    {
                        (_c = check()) === null || _c === void 0 ? void 0 : _c.destroy();
                        return [3, 23];
                    }
                    _e.label = 22;
                case 22:
                    {
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setTitle("Music player")
                                    .setDescription("A simple music player since Susan decided to killed off most of available bots\n" +
                                    "Some shit might break, well blame youtube for that, try disconnecting the bot if something really bad happens\n" +
                                    "Subcommands below")
                                    .setColor("#ed2261")
                                    .setThumbnail(bot.cli().user.avatarURL())
                                    .addField("yt play/p [query]", "Search and play a track, can be a video or playlist url")
                                    .addField("yt search/sr [query]", "Search for a track")
                                    .addField("yt skip/fs", "Skip current track (if somebody decided to put an earrape")
                                    .addField("yt now", "Show current track info")
                                    .addField("yt remove/rm [index(es)]", "Remove tracks from playlist, can be multiple, separated by spaces")
                                    .addField("yt list/ls", "List all tracks in current queue")
                                    .addField("yt stop/dc", "Destroy your music session and ruin your day"),
                            ]
                        });
                    }
                    _e.label = 23;
                case 23: return [2];
            }
        });
    });
}
exports.CreatePlayer = CreatePlayer;
