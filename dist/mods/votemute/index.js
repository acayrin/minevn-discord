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
exports.VoteMute = void 0;
var crypto = require("crypto");
var discord_js_1 = require("discord.js");
function VoteMute(message, args, bot) {
    return __awaiter(this, void 0, void 0, function () {
        var com, user, vote;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!args)
                        return [2];
                    com = args.join();
                    user = message.mentions.members.first();
                    if (!(!user && com.length > 0)) return [3, 4];
                    if (!parseInt(com)) return [3, 2];
                    return [4, message.guild.members.fetch({ user: [com] })];
                case 1:
                    user = (_a.sent()).first();
                    return [3, 4];
                case 2: return [4, message.guild.members.fetch({ query: com, limit: 1 })];
                case 3:
                    user = (_a.sent()).first();
                    _a.label = 4;
                case 4:
                    if (!user)
                        return [2, message.channel.send("Looking for a ghost? Try that again but be sure to mention someone")];
                    vote = new Vote(user, message.channel, bot);
                    vote.start();
                    return [2];
            }
        });
    });
}
exports.VoteMute = VoteMute;
var Vote = (function () {
    function Vote(target, channel, bot) {
        this.vote_Y = 0;
        this.vote_N = 0;
        this.id = crypto.createHash('md5').update(Date.now().toString(), 'utf-8').digest('hex').slice(0, 7);
        this.embed = new discord_js_1.MessageEmbed()
            .setTimestamp()
            .setColor('#ed2261')
            .setTitle('Vote mute')
            .setDescription('Vote mute')
            .setFooter('i love democracy');
        this.bot = bot;
        this.target = target;
        this.channel = channel;
    }
    Vote.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.getUserMutedState(this.target)];
                    case 1:
                        if (_b.sent())
                            return [2, this.channel.send("User **".concat(this.target.user.tag, "** is already muted, give them some break"))];
                        if (this.bot.debug)
                            this.bot.logger.debug("[VoteMute - ".concat(this.id, "] A vote has started, target: ").concat(this.target.id));
                        _a = this;
                        return [4, this.channel.send({ embeds: [
                                    this.embed
                                        .setTitle("Mute: ".concat(this.target.user.tag))
                                        .setDescription("Voting ends in ".concat(this.bot.config.mute.timer, "s"))
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
                            time: this.bot.config.mute.timer * 1000,
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
    Vote.prototype.onCollect = function (react) {
        if ('👍'.includes(react.emoji.name))
            this.vote_Y++;
        if ('👎'.includes(react.emoji.name))
            this.vote_N++;
    };
    Vote.prototype.onRemove = function (react) {
        if ('👍'.includes(react.emoji.name))
            this.vote_Y--;
        if ('👎'.includes(react.emoji.name))
            this.vote_N--;
    };
    Vote.prototype.onEnd = function () {
        if (this.bot.debug)
            this.bot.logger.debug("[VoteMute - ".concat(this.id, "] Vote ended with ").concat(this.vote_Y, ":").concat(this.vote_N, " (total ").concat(this.vote_Y + this.vote_N, ")"));
        if (this.vote_Y > this.vote_N)
            this.onWin();
        else
            this.onLose();
    };
    Vote.prototype.onWin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var role;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getMutedRole()];
                    case 1:
                        role = _a.sent();
                        if (!role.first())
                            return [2, this.channel.send("Can't find any **muted** role, stop abusing now.")];
                        this.msg.edit({ embeds: [
                                this.embed
                                    .setTitle("Muted: ".concat(this.target.user.tag, " [").concat(this.bot.config.mute.duration, "m]"))
                                    .setDescription("reason: mob vote\namount ".concat(this.vote_Y, " \uD83D\uDC4D : ").concat(this.vote_N, " \uD83D\uDC4E"))
                            ] });
                        this.target.roles.add(role);
                        setTimeout(function (_) {
                            _this.target.roles.remove(role);
                            _this.channel.send("Unmuted **".concat(_this.target.user.tag, "**"));
                            if (_this.bot.debug)
                                _this.bot.logger.debug("[VoteMute - ".concat(_this.id, "] Unmuted user ").concat(_this.target.id));
                        }, this.bot.config.mute.duration * 60000);
                        return [2];
                }
            });
        });
    };
    Vote.prototype.onLose = function () {
        this.msg.edit({ embeds: [
                this.embed
                    .setTitle("Vote ended, nobody was abused")
                    .setDescription("amount ".concat(this.vote_Y, " \uD83D\uDC4D : ").concat(this.vote_N, " \uD83D\uDC4E"))
            ] });
    };
    Vote.prototype.getMutedRole = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gr, mr;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.channel.guild.roles.fetch()];
                    case 1:
                        gr = _a.sent();
                        mr = gr.filter(function (r) { return r.name.toLowerCase().includes(_this.bot.config.mute.role || 'mute'); });
                        return [2, mr];
                }
            });
        });
    };
    Vote.prototype.getUserMutedState = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var role;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getMutedRole()];
                    case 1:
                        role = _a.sent();
                        if (!role.first())
                            return [2, false];
                        else if (user.roles.cache.has(role.first().id))
                            return [2, true];
                        else
                            return [2, false];
                        return [2];
                }
            });
        });
    };
    return Vote;
}());
