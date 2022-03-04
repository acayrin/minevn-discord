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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.MusicPlayer = void 0;
var Voice = __importStar(require("@discordjs/voice"));
var Discord = __importStar(require("discord.js"));
var GenerateId_1 = require("../../../core/utils/GenerateId");
var Filters_1 = require("../Filters");
var Functions_1 = require("../Functions");
var Language_1 = require("../Language");
var MusicTrack_1 = require("./MusicTrack");
var discord_ytdl_core_1 = __importDefault(require("discord-ytdl-core"));
var MusicPlayer = (function () {
    function MusicPlayer(tchannel, vchannel, manager, bot) {
        var _this = this;
        this.id = (0, GenerateId_1.id)();
        this.filter = "none";
        this.__queue = [];
        this.__equeue = [];
        this.loop = 0;
        this.__player = Voice.createAudioPlayer();
        this.__reconnectAttempts = 0;
        this.__e_continue = false;
        this.__e_continue_attempts = 0;
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
        this.__bot = bot;
        this.__connect();
        this.__player.on("error", this.__playerOnError.bind(this));
        this.__player.on("stateChange", this.__playerStateChange.bind(this));
    }
    MusicPlayer.prototype.__connect = function () {
        var _a;
        this.__connection = Voice.joinVoiceChannel({
            channelId: this.__vchannel.id,
            guildId: this.__guild.id,
            adapterCreator: this.__vchannel.guild.voiceAdapterCreator
        });
        this.__connection.subscribe(this.__player);
        this.__connection.on("stateChange", this.__connectionStateChange.bind(this));
        (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(this.id, "] Created new voice connection"));
        return this.__connection;
    };
    MusicPlayer.prototype.__reconnect = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(!this.__vchannel.deleted && this.__reconnectAttempts < 5)) return [3, 2];
                        this.__reconnectAttempts++;
                        (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(this.id, "] Attempting to reconnect ").concat(this.__reconnectAttempts, "/5 after ").concat(this.__reconnectAttempts * 3, "s"));
                        this.__connection.removeAllListeners();
                        return [4, new Promise(function (resolve) { return setTimeout(function () { return resolve(_this.__connect()); }, _this.__reconnectAttempts * 3e3); })];
                    case 1:
                        _c.sent();
                        return [3, 3];
                    case 2:
                        this.__manager.remove(this);
                        this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_DESTROYED);
                        (_b = this.__bot) === null || _b === void 0 ? void 0 : _b.emit("debug", "[MusicPlayer - ".concat(this.id, "] Player was destroyed"));
                        _c.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    MusicPlayer.prototype.__connectionStateChange = function (_, newState) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_c) {
                if (newState.status === Voice.VoiceConnectionStatus.Disconnected) {
                    (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(this.id, "] VC disconnected, attempting to reconnect"));
                    Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Connecting, 20e3)["catch"](function (e) {
                        var _a;
                        (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] VC encountered an error [1]: ").concat(e));
                        try {
                            _this.__connection.destroy();
                        }
                        catch (_b) { }
                    });
                }
                else if (newState.status === Voice.VoiceConnectionStatus.Connecting ||
                    newState.status === Voice.VoiceConnectionStatus.Signalling) {
                    Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Ready, 20e3)
                        .then(function () {
                        var _a;
                        _this.__reconnectAttempts = 0;
                        (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] VC successfully connected"));
                    })["catch"](function (e) {
                        var _a;
                        (_a = _this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(_this.id, "] VC encountered an error [2]: ").concat(e));
                        try {
                            _this.__connection.destroy();
                        }
                        catch (_b) { }
                    });
                }
                else if (newState.status === Voice.VoiceConnectionStatus.Destroyed) {
                    (_b = this.__bot) === null || _b === void 0 ? void 0 : _b.emit("debug", "[MusicPlayer - ".concat(this.id, "] VC was destroyed"));
                    this.__reconnect();
                }
                return [2];
            });
        });
    };
    MusicPlayer.prototype.__playerStateChange = function (oldState, newState) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var bf, af;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oldState.status !== Voice.AudioPlayerStatus.Idle && newState.status === Voice.AudioPlayerStatus.Idle)) return [3, 3];
                        bf = this.__queue.at(0);
                        if (!(this.__e_continue && this.__e_continue_attempts < 5)) return [3, 2];
                        this.__e_continue = false;
                        this.__e_continue_attempts++;
                        return [4, this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_TRACK_RESUMED.replace(/%track_name%+/g, bf.name).replace(/%track_duration%+/g, (0, Functions_1.timeFormat)(Math.floor(((_a = this.current) === null || _a === void 0 ? void 0 : _a.playbackDuration) / 1000))))];
                    case 1:
                        _b.sent();
                        setTimeout(function () { var _a; return _this.play(((_a = _this.current) === null || _a === void 0 ? void 0 : _a.playbackDuration) / 1000); }, 1e3);
                        return [3, 3];
                    case 2:
                        if (this.loop === 1 && this.__e_continue_attempts === 5)
                            this.loop = 0;
                        this.__e_continue_attempts = 0;
                        if (this.loop === 1) {
                            return [2, this.play()];
                        }
                        this.__equeue.push(this.__queue.shift());
                        af = this.__queue.at(0);
                        if (af) {
                            return [2, this.play()];
                        }
                        else if (this.loop === 2) {
                            this.__queue = this.__equeue;
                            this.__equeue = [];
                            this.play();
                        }
                        else
                            this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_QUEUE_ENDED);
                        _b.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    MusicPlayer.prototype.__playerOnError = function (e) {
        var _a, _b, _c;
        (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[MusicPlayer - ".concat(this.id, "] PLAYER - Track: ").concat((_b = this.current) === null || _b === void 0 ? void 0 : _b.metadata.url, " (at ").concat((0, Functions_1.timeFormat)(Math.floor((((_c = this.current) === null || _c === void 0 ? void 0 : _c.playbackDuration) || 0) / 1000)), ") - Encountered error: ").concat(e));
        if (!this.current) {
            this.__tchannel.send(Language_1.MusicPlayerLang.ERR_TRACK_UNKNOWN.replace(/%error%+/g, e.message));
        }
        else {
            if (e.message.includes("410")) {
                this.__tchannel.send(Language_1.MusicPlayerLang.ERR_TRACK_AGE_RESTRICTED);
            }
            else if (e.message.includes("No such format found")) {
                this.__tchannel.send(Language_1.MusicPlayerLang.ERR_TRACK_NO_OPUS);
            }
            else if (e.message.includes("403")) {
                this.__tchannel.send(Language_1.MusicPlayerLang.ERR_TRACK_RATE_LIMITED);
                this.__e_continue = true;
            }
            else {
                this.__tchannel.send(Language_1.MusicPlayerLang.ERR_TRACK_UNKNOWN.replace(/%error%+/g, e.message));
                this.__e_continue = true;
            }
        }
    };
    MusicPlayer.prototype.removeTrack = function (input) {
        var search = input instanceof MusicTrack_1.MusicTrack
            ? this.__queue.find(function (track) { return track === input; })
            : typeof input === "string"
                ? this.__queue.find(function (track) { return track.name.includes(input.toLowerCase()); })
                : this.__queue.at(input);
        if (!search)
            return undefined;
        return this.__queue.splice(this.__queue.indexOf(search), 1).shift();
    };
    MusicPlayer.prototype.play = function (start) {
        try {
            var filter = Filters_1.AudioFilter[this.filter];
            var stream = (0, discord_ytdl_core_1["default"])(this.__queue.at(0).url, {
                filter: "audioonly",
                quality: "highestaudio",
                highWaterMark: 1 << 16,
                seek: Math.floor(start),
                opusEncoded: true,
                encoderArgs: filter ? ["-af", filter] : []
            });
            var resource = Voice.createAudioResource(stream, {
                inputType: Voice.StreamType.Opus,
                metadata: this.__queue.at(0)
            });
            this.current = resource;
            this.current.playbackDuration = start ? start * 1000 : 0;
            this.__player.play(resource);
        }
        catch (e) {
            this.__player.emit("error", e);
        }
    };
    MusicPlayer.prototype.applyfilter = function (name) {
        var _this = this;
        if (name.toLowerCase().includes("none")) {
            this.filter = "none";
            this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_FILTER_RESET);
        }
        else {
            Object.keys(Filters_1.AudioFilter).forEach(function (k) {
                if (k.toLowerCase().includes(name)) {
                    _this.filter = k;
                    _this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_FILTER_SET.replace(/%filter%+/g, _this.filter));
                }
            });
        }
        this.__e_continue = true;
        this.__player.stop();
    };
    MusicPlayer.prototype.applyloop = function (mode) {
        if ([0, 1, 2].includes(Number(mode))) {
            this.loop = Number(mode);
            if (this.loop === 1)
                this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_LOOP_SET.replace(/%loop%+/g, "current"));
            if (this.loop === 2)
                this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_LOOP_SET.replace(/%loop%+/g, "queue"));
            if (this.loop === 0)
                this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_LOOP_SET.replace(/%loop%+/g, "none"));
        }
    };
    MusicPlayer.prototype.skip = function () {
        this.__player.stop(true);
    };
    MusicPlayer.prototype.togglePauseResume = function () {
        this.isPlaying()
            ? (this.__player.pause(true), this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_PAUSED))
            : (this.__player.unpause(), this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_RESUMED));
    };
    MusicPlayer.prototype.disconnect = function () {
        try {
            this.__reconnectAttempts += 69;
            this.__connection.destroy();
        }
        catch (_a) {
            this.__tchannel.send(Language_1.MusicPlayerLang.PLAYER_ADY_DESTROYED);
        }
    };
    return MusicPlayer;
}());
exports.MusicPlayer = MusicPlayer;
