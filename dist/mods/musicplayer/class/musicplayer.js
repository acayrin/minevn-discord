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
var functions_1 = require("../functions");
var lang_1 = require("../lang");
var musictrack_1 = require("./musictrack");
var ytdl = require("ytdl-core");
var MusicPlayer = (function () {
    function MusicPlayer(tchannel, vchannel, manager, bot) {
        var _this = this;
        this.id = (0, generateid_1.id)();
        this.__queue = [];
        this.__playduration = 0;
        this.__reconnectAttempts = 0;
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
        this.__player.on("error", this.__playerOnError.bind(this));
        this.__player.on("stateChange", this.__playerStateChange.bind(this));
    }
    MusicPlayer.prototype.__connectionStateChange = function (_, newState) {
        var _this = this;
        var _a, _b, _c;
        if (newState.status === Voice.VoiceConnectionStatus.Disconnected) {
            (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(this.id, "] Player disconnected, attempting to reconnect"));
            Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Connecting, 20e3)["catch"](function (e) {
                var _a, _b;
                if (_this.__connection.rejoinAttempts <= 5) {
                    (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] [A] Attempting to reconnect (").concat(_this.__connection.rejoinAttempts, "/5)"));
                    _this.__connection.rejoin();
                }
                else {
                    (_b = _this.__bot) === null || _b === void 0 ? void 0 : _b.emit("debug", "[MusicPlayer - ".concat(_this.id, "] [A] Player encountered an error: ").concat(e));
                    _this.__connection.destroy();
                }
            });
        }
        else if (newState.status === Voice.VoiceConnectionStatus.Connecting ||
            newState.status === Voice.VoiceConnectionStatus.Signalling) {
            Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Ready, 20e3)["catch"](function (e) {
                var _a;
                (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] [B] Player encountered an error: ").concat(e));
                _this.__connection.destroy();
            });
        }
        else if (newState.status === Voice.VoiceConnectionStatus.Destroyed) {
            if (!this.__vchannel.deleted && this.__reconnectAttempts < 5) {
                this.__reconnectAttempts++;
                (_b = this.__bot) === null || _b === void 0 ? void 0 : _b.emit("debug", "[MusicPlayer - ".concat(this.id, "] [B] Attempting to reconnect (").concat(this.__reconnectAttempts, "/5)"));
                this.__connect();
            }
            else {
                (_c = this.__bot) === null || _c === void 0 ? void 0 : _c.emit("debug", "[MusicPlayer - ".concat(this.id, "] Player was destroyed"));
                this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_DESTROYED);
                this.__manager.remove(this);
            }
        }
    };
    MusicPlayer.prototype.__playerStateChange = function (oldState, newState) {
        return __awaiter(this, void 0, void 0, function () {
            var bf, af;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(oldState.status !== Voice.AudioPlayerStatus.Idle && newState.status === Voice.AudioPlayerStatus.Idle)) return [3, 7];
                        bf = this.__queue.shift();
                        af = this.__queue.at(0);
                        this.current = undefined;
                        if (!af) return [3, 6];
                        if (!af.url.includes(bf.url)) return [3, 2];
                        return [4, this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_TRACK_RESUMED.replace(/%track_name%+/g, bf.name).replace(/%track_duration%+/g, (0, functions_1.timeFormat)(Math.floor(this.__playduration / 1000))))];
                    case 1:
                        _a.sent();
                        return [3, 5];
                    case 2:
                        this.__playduration = 0;
                        return [4, this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_FINISHED.replace(/%track_name%+/g, bf.name).replace(/%track_requester%+/g, bf.requester.user.tag))];
                    case 3:
                        _a.sent();
                        return [4, this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_STARTED.replace(/%track_name%+/g, af.name).replace(/%track_requester%+/g, af.requester.user.tag))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        setTimeout(function () {
                            _this.play();
                        }, 2e3);
                        return [3, 7];
                    case 6:
                        this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_QUEUE_ENDED);
                        _a.label = 7;
                    case 7: return [2];
                }
            });
        });
    };
    MusicPlayer.prototype.__playerOnError = function (e) {
        var _a, _b;
        (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(this.id, "] PLAYER - Track: ").concat((_b = this.current) === null || _b === void 0 ? void 0 : _b.metadata.url, " (at ").concat((0, functions_1.timeFormat)(Math.floor(this.__playduration / 1000)), ") - Encountered error: ").concat(e));
        if (!this.current) {
            this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_UNKNOWN.replace(/%error%+/g, e.message));
        }
        else {
            this.__playduration = this.current.playbackDuration;
            if (e.message.includes("410")) {
                this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_AGE_RESTRICTED);
            }
            else if (e.message.includes("No such format found")) {
                this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_NO_OPUS);
            }
            else if (e.message.includes("403")) {
                this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_RATE_LIMITED);
                this.__queue.unshift(this.current.metadata);
            }
            else {
                this.__tchannel.send(lang_1.MusicPlayerLang.ERR_TRACK_UNKNOWN.replace(/%error%+/g, e.message));
                this.__queue.unshift(this.current.metadata);
            }
        }
    };
    MusicPlayer.prototype.__connect = function () {
        this.__connection = Voice.joinVoiceChannel({
            channelId: this.__vchannel.id,
            guildId: this.__guild.id,
            adapterCreator: this.__vchannel.guild.voiceAdapterCreator
        });
        this.__connection.subscribe(this.__player);
        this.__connection.on("stateChange", this.__connectionStateChange.bind(this));
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
        return __awaiter(this, void 0, void 0, function () {
            var demux, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, Voice.demuxProbe(ytdl(this.__queue.at(0).url, {
                                filter: "audioonly",
                                quality: "highestaudio",
                                highWaterMark: 1 << 24,
                                begin: this.__playduration
                            }))];
                    case 1:
                        demux = _a.sent();
                        this.__player.play((this.current || (this.current = Voice.createAudioResource(demux.stream, {
                            inputType: demux.type,
                            metadata: this.__queue.at(0)
                        }))));
                        return [3, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.__player.emit("error", e_1);
                        return [3, 3];
                    case 3: return [2];
                }
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
    MusicPlayer.prototype.disconnect = function () {
        try {
            this.__reconnectAttempts += 69;
            this.__connection.destroy();
        }
        catch (_a) {
            this.__tchannel.send(lang_1.MusicPlayerLang.PLAYER_ADY_DESTROYED);
        }
    };
    return MusicPlayer;
}());
exports.MusicPlayer = MusicPlayer;
