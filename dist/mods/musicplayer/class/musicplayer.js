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
exports.MusicPlayer = void 0;
var Voice = __importStar(require("@discordjs/voice"));
var Discord = __importStar(require("discord.js"));
var generateid_1 = require("../../../core/utils/generateid");
var lang_1 = require("../lang");
var musictrack_1 = require("./musictrack");
var ytdl = require("ytdl-core");
var MusicPlayer = (function () {
    function MusicPlayer(tchannel, vchannel, manager, bot) {
        var _this = this;
        this.id = (0, generateid_1.id)();
        this.__queue = [];
        this.__playduration = 0;
        this.getGuild = function () { return _this.__guild; };
        this.getQueue = function () { return _this.__queue; };
        this.addTrack = function (track) {
            return Array.isArray(track) ? track.forEach(function (tk) { return _this.__queue.push(tk); }) : _this.__queue.push(track);
        };
        this.isPlaying = function () { var _a; return (((_a = _this.__player) === null || _a === void 0 ? void 0 : _a.state.status) || false) === Voice.AudioPlayerStatus.Playing; };
        if (!(tchannel instanceof Discord.TextChannel)) {
            tchannel.send("This is not a text channel");
            return;
        }
        this.__tchannel = tchannel;
        this.__vchannel = vchannel;
        this.__guild = tchannel.guild;
        this.__manager = manager;
        this.__player = Voice.createAudioPlayer();
        this.__bot = bot;
        this.__connect();
        this.__connection.on("debug", function (m) {
            var _a;
            (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] ").concat(m));
        });
        this.__connection.on("stateChange", function (_, newState) { return __awaiter(_this, void 0, void 0, function () {
            var e_1, e_2;
            var _this = this;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!(newState.status === Voice.VoiceConnectionStatus.Disconnected)) return [3, 9];
                        if (!(newState.reason === Voice.VoiceConnectionDisconnectReason.WebSocketClose &&
                            newState.closeCode === 4014)) return [3, 5];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4, Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Connecting, 20e3)];
                    case 2:
                        _e.sent();
                        return [3, 4];
                    case 3:
                        e_1 = _e.sent();
                        this.__connection.destroy();
                        (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(this.id, "] CONN - Encountered error while reconnecting: ").concat(e_1));
                        return [3, 4];
                    case 4: return [3, 8];
                    case 5:
                        if (!(this.__connection.rejoinAttempts < 5)) return [3, 7];
                        (_b = this.__bot) === null || _b === void 0 ? void 0 : _b.emit("debug", "[MusicPlayer - ".concat(this.id, "] CONN - Reconnecting attempt ").concat(this.__connection.rejoinAttempts));
                        return [4, new Promise(function (r) { return setTimeout(r, (_this.__connection.rejoinAttempts + 1) * 3e3).unref(); })];
                    case 6:
                        _e.sent();
                        this.__connection.rejoin();
                        return [3, 8];
                    case 7:
                        (_c = this.__bot) === null || _c === void 0 ? void 0 : _c.emit("debug", "[MusicPlayer - ".concat(this.id, "] CONN - Disconnected after 5 attempts"));
                        this.__connection.destroy();
                        _e.label = 8;
                    case 8: return [3, 15];
                    case 9:
                        if (!(newState.status === Voice.VoiceConnectionStatus.Connecting ||
                            newState.status === Voice.VoiceConnectionStatus.Signalling)) return [3, 14];
                        _e.label = 10;
                    case 10:
                        _e.trys.push([10, 12, , 13]);
                        return [4, Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Ready, 20e3)];
                    case 11:
                        _e.sent();
                        return [3, 13];
                    case 12:
                        e_2 = _e.sent();
                        (_d = this.__bot) === null || _d === void 0 ? void 0 : _d.emit("debug", "[MusicPlayer - ".concat(this.id, "] CONN - Encountered error: ").concat(e_2));
                        if (this.__connection.state.status !== Voice.VoiceConnectionStatus.Destroyed) {
                            this.__connection.destroy();
                        }
                        return [3, 13];
                    case 13: return [3, 15];
                    case 14:
                        if (newState.status === Voice.VoiceConnectionStatus.Destroyed) {
                            this.destroy();
                        }
                        _e.label = 15;
                    case 15: return [2];
                }
            });
        }); });
        this.__player.on("error", function (e) {
            var _a;
            _this.__playduration = _this.current.playbackDuration;
            if (e.message.includes("410")) {
                _this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_AGE_RESTRICTED);
            }
            else if (e.message.includes("EBML")) {
                _this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_NO_OPUS);
            }
            else if (e.message.includes("403")) {
                _this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_RATE_LIMITED);
                _this.__queue.unshift(_this.current.metadata);
            }
            else {
                _this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_UNKNOWN.replace(/%error%+/g, e.message));
                _this.__queue.unshift(_this.current.metadata);
            }
            (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] PLAYER - Track: ").concat(_this.current.metadata.url, " - Encountered error: ").concat(e));
        });
        this.__player.on("stateChange", function (oldState, newState) {
            if (oldState.status !== Voice.AudioPlayerStatus.Idle && newState.status === Voice.AudioPlayerStatus.Idle) {
                var bf_1 = _this.__queue.shift();
                var af_1 = _this.__queue.at(0);
                _this.current = null;
                _this.__tchannel
                    .send(lang_1.MusicPlayerLang.PLAYER_FINISHED.replace(/%track_name%+/g, bf_1.name).replace(/%track_requester%+/g, bf_1.author.user.tag))
                    .then(function () {
                    if (af_1)
                        _this.__tchannel
                            .send(lang_1.MusicPlayerLang.PLAYER_STARTED.replace(/%track_name%+/g, af_1.name).replace(/%track_requester%+/g, af_1.author.user.tag))
                            .then(function () {
                            return setTimeout(function () {
                                if (af_1.url !== bf_1.url)
                                    _this.__playduration = 0;
                                _this.play();
                            }, 2e3);
                        });
                    else
                        _this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_QUEUE_ENDED);
                });
            }
        });
        this.__player.on("debug", function (m) {
            var _a;
            (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] ").concat(m));
        });
    }
    MusicPlayer.prototype.__connect = function () {
        this.__connection = Voice.joinVoiceChannel({
            channelId: this.__vchannel.id,
            guildId: this.__guild.id,
            adapterCreator: this.__vchannel.guild.voiceAdapterCreator
        });
        this.__connection.subscribe(this.__player);
    };
    MusicPlayer.prototype.removeTrack = function (input) {
        var search = input instanceof musictrack_1.MusicTrack
            ? this.__queue.find(function (track) { return track === input; })
            : typeof input === "string"
                ? this.__queue.find(function (track) { return track.name.includes(input.toLowerCase()); })
                : this.__queue.at(input);
        if (!search)
            return undefined;
        return this.__queue.splice(this.__queue.indexOf(search), 1).shift();
    };
    MusicPlayer.prototype.play = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                if (this.__queue.length === 0)
                    return [2];
                try {
                    this.__player.play((this.current || (this.current = Voice.createAudioResource(ytdl(this.__queue.at(0).url, {
                        filter: "audioonly",
                        quality: "highestaudio",
                        highWaterMark: 1 << 24,
                        begin: this.__playduration
                    }).on("error", function (e) {
                        var _a;
                        _this.__tchannel.send(lang_1.MusicPlayerLang.ERR_PLAYER_UNKNOWN.replace(/%error%+/g, e.message));
                        _this.play();
                        (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] PLAY - Track: ").concat(_this.current.metadata.url, " - Encountered error: ").concat(e));
                    }), {
                        inputType: Voice.StreamType.WebmOpus,
                        metadata: this.__queue.at(0)
                    }))));
                }
                catch (e) {
                    this.__tchannel.send(lang_1.MusicPlayerLang.ERR_PLAYER_UNKNOWN.replace(/%error%+/g, e.message));
                    this.play();
                    (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(this.id, "] PLAY - Track: ").concat(this.current.metadata.url, " - Encountered error: ").concat(e));
                }
                return [2, this];
            });
        });
    };
    MusicPlayer.prototype.skip = function () {
        if (this.__queue.length > 1) {
            this.current = null;
            this.__player.stop();
        }
    };
    MusicPlayer.prototype.togglePauseResume = function () {
        this.isPlaying()
            ? (this.__player.pause(), this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_PAUSED))
            : (this.__player.unpause(), this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_RESUMED));
    };
    MusicPlayer.prototype.destroy = function () {
        try {
            this.__connection.destroy();
        }
        catch (_a) { }
        this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_DESTROYED);
        this.__manager.remove(this);
    };
    return MusicPlayer;
}());
exports.MusicPlayer = MusicPlayer;
