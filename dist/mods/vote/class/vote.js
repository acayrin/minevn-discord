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
exports.Vote = void 0;
var crypto = __importStar(require("crypto"));
var Discord = __importStar(require("discord.js"));
var __1 = require("..");
var Vote = (function () {
    function Vote(target, channel, bot, options) {
        this.target = undefined;
        this.channel = undefined;
        this.guild = undefined;
        this.msg = undefined;
        this._bot = undefined;
        this._vote_Y = 0;
        this._vote_N = 0;
        this.reason = "mob vote";
        this.timer = 30;
        this.id = crypto.createHash("md5").update(Date.now().toString(), "utf-8").digest("hex").slice(0, 7);
        __1.voteMgr.add(this);
        this._bot = bot;
        this.channel = channel;
        this.guild = channel.guild;
        this.target = target;
        if (options) {
            if (options.reason)
                this.reason = options.reason;
            if (options.timer)
                this.timer = options.timer;
        }
    }
    Vote.prototype._embed = function () {
        return new Discord.MessageEmbed()
            .setTimestamp()
            .setColor("#ed2261")
            .setTitle("Vote")
            .setDescription("Voting ends in ".concat(this.timer, "s"))
            .setFooter("i love democracy");
    };
    Vote.prototype.__onEnd = function () {
        var _this = this;
        this._onEnd()["finally"](function () { return __1.voteMgr.remove(_this); });
    };
    Vote.prototype.__onCollect = function (react) {
        this._onCollect(react);
    };
    Vote.prototype.__onRemove = function (react) {
        this._onRemove(react);
    };
    Vote.prototype._getTarget = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.guild.members.fetch({
                            user: id || this.target.id,
                            cache: false
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Vote.prototype._run = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this._preload()];
                    case 1:
                        if (_b.sent())
                            return [2];
                        if (this._bot.debug)
                            this._bot.logger.debug("[Vote - ".concat(this.id, "] A vote has started, target: ").concat(this.target.id));
                        _a = this;
                        return [4, this.channel.send({
                                embeds: [options.embed || this._embed()]
                            })];
                    case 2:
                        _a.msg = _b.sent();
                        return [4, this.msg.react("👍")];
                    case 3:
                        _b.sent();
                        return [4, this.msg.react("👎")];
                    case 4:
                        _b.sent();
                        this.msg
                            .createReactionCollector({
                            filter: function (r, u) { return ["👍", "👎"].includes(r.emoji.name) && !u.bot; },
                            time: this.timer * 1000,
                            dispose: true
                        })
                            .on("collect", this.__onCollect.bind(this))
                            .on("remove", this.__onRemove.bind(this))
                            .on("end", this.__onEnd.bind(this));
                        return [2];
                }
            });
        });
    };
    Vote.prototype._preload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    Vote.prototype._onCollect = function (react) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if ("👍".includes(react.emoji.name))
                    this._vote_Y++;
                if ("👎".includes(react.emoji.name))
                    this._vote_N++;
                return [2];
            });
        });
    };
    Vote.prototype._onRemove = function (react) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if ("👍".includes(react.emoji.name))
                    this._vote_Y--;
                if ("👎".includes(react.emoji.name))
                    this._vote_N--;
                return [2];
            });
        });
    };
    Vote.prototype._onEnd = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this._bot.debug)
                    this._bot.logger.debug("[Vote - ".concat(this.id, "] Vote ended with ").concat(this._vote_Y, ":").concat(this._vote_N, " (total ").concat(this._vote_Y + this._vote_N, ")"));
                if (this._vote_Y > this._vote_N)
                    this._onWin();
                else
                    this._onLose();
                return [2];
            });
        });
    };
    Vote.prototype._onWin = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.msg.edit({
                    embeds: [
                        this._embed()
                            .setTitle("Vote ended, someone was abused")
                            .setDescription("amount ".concat(this._vote_Y, " \uD83D\uDC4D : ").concat(this._vote_N, " \uD83D\uDC4E")),
                    ]
                });
                return [2];
            });
        });
    };
    Vote.prototype._onLose = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.msg.edit({
                    embeds: [
                        this._embed()
                            .setTitle("Vote ended, nothing happened, you saw nothing")
                            .setDescription("amount ".concat(this._vote_Y, " \uD83D\uDC4D : ").concat(this._vote_N, " \uD83D\uDC4E")),
                    ]
                });
                return [2];
            });
        });
    };
    return Vote;
}());
exports.Vote = Vote;
