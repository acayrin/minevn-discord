"use strict";
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
var crypto = require("crypto");
var discord_js_1 = require("discord.js");
var Vote = (function () {
    function Vote(target, channel, bot, options) {
        this.target = undefined;
        this.channel = undefined;
        this.msg = undefined;
        this.bot = undefined;
        this.vote_Y = 0;
        this.vote_N = 0;
        this.reason = "mob vote";
        this.timer = 30;
        this.id = crypto.createHash('md5').update(Date.now().toString(), 'utf-8').digest('hex').slice(0, 7);
        this.embed = new discord_js_1.MessageEmbed()
            .setTimestamp()
            .setColor('#ed2261')
            .setTitle("Vote")
            .setDescription("Voting ends in ".concat(this.timer, "s"))
            .setFooter('i love democracy');
        this.bot = bot;
        this.target = target;
        this.channel = channel;
        if (options) {
            this.reason = options.reason;
            this.timer = options.timer;
        }
    }
    Vote.prototype.run = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.preload()];
                    case 1:
                        if (_b.sent())
                            return [2];
                        if (this.bot.debug)
                            this.bot.logger.debug("[Vote - ".concat(this.id, "] A vote has started, target: ").concat(this.target.id));
                        _a = this;
                        return [4, this.channel.send({ embeds: [
                                    options.embed || this.embed
                                ] })];
                    case 2:
                        _a.msg = _b.sent();
                        return [4, this.msg.react('👍')];
                    case 3:
                        _b.sent();
                        return [4, this.msg.react('👎')];
                    case 4:
                        _b.sent();
                        this.msg.createReactionCollector({
                            filter: function (r, u) { return (['👍', '👎'].includes(r.emoji.name) && !u.bot); },
                            time: this.timer * 1000,
                            dispose: true
                        })
                            .on('collect', this.onCollect.bind(this))
                            .on('remove', this.onRemove.bind(this))
                            .on('end', this.onEnd.bind(this));
                        return [2];
                }
            });
        });
    };
    Vote.prototype.preload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    Vote.prototype.onCollect = function (react) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if ('👍'.includes(react.emoji.name))
                    this.vote_Y++;
                if ('👎'.includes(react.emoji.name))
                    this.vote_N++;
                return [2];
            });
        });
    };
    Vote.prototype.onRemove = function (react) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if ('👍'.includes(react.emoji.name))
                    this.vote_Y--;
                if ('👎'.includes(react.emoji.name))
                    this.vote_N--;
                return [2];
            });
        });
    };
    Vote.prototype.onEnd = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.bot.debug)
                    this.bot.logger.debug("[Vote - ".concat(this.id, "] Vote ended with ").concat(this.vote_Y, ":").concat(this.vote_N, " (total ").concat(this.vote_Y + this.vote_N, ")"));
                if (this.vote_Y > this.vote_N)
                    this.onWin();
                else
                    this.onLose();
                return [2];
            });
        });
    };
    Vote.prototype.onWin = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    Vote.prototype.onLose = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.msg.edit({ embeds: [
                        this.embed
                            .setTitle("Vote ended, nobody was abused")
                            .setDescription("amount ".concat(this.vote_Y, " \uD83D\uDC4D : ").concat(this.vote_N, " \uD83D\uDC4E"))
                    ] });
                return [2];
            });
        });
    };
    return Vote;
}());
exports.Vote = Vote;
