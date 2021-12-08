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
exports.voteMgr = exports.VUM = exports.VM = void 0;
var utils_1 = require("../../core/utils");
var votemanager_1 = require("./class/votemanager");
var votemute_1 = require("./class/votemute");
var voteunmute_1 = require("./class/voteunmute");
var recentmutes = __importStar(require("./recentmute"));
var voteMgr = new votemanager_1.VoteManager();
exports.voteMgr = voteMgr;
function VoteSomebody(message, args, bot, unmute) {
    return __awaiter(this, void 0, void 0, function () {
        var channel, lookup, reason, user, session, role;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!args)
                        return [2];
                    if (bot.config.mute.channel)
                        if (!bot.config.mute.channel.includes(message.channelId)) {
                            channel = message.guild.channels.cache
                                .filter(function (ch) { return bot.config.mute.channel.includes(ch.id); })
                                .first();
                            return [2, message.reply("Buddy, ya can't vote someone outside of ".concat(channel))];
                        }
                    lookup = args.shift();
                    reason = args.join(" ").length > 0 ? args.join(" ") : undefined;
                    user = message.mentions.members.first();
                    if (!(!user && lookup)) return [3, 2];
                    return [4, (0, utils_1.getUser)(lookup, message.guild)];
                case 1:
                    user = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!user) {
                        return [2, message.channel.send("Looking for a ghost? Try that again but be sure to mention someone")];
                    }
                    if (user.user.bot) {
                        return [2, message.channel.send("**".concat(user.user.tag, "** is a robot u sussy baka"))];
                    }
                    session = voteMgr.getSession().find(function (session) { return session.target.id.includes(user.id); });
                    if (session) {
                        return [2, (session.msg || message).reply("There is an ongoing vote for **".concat(user.user.tag, "** so stopping now"))];
                    }
                    return [4, (0, utils_1.getRole)(bot.config.mute.role || "mute", message.member.guild)];
                case 3:
                    role = _a.sent();
                    if (!role) {
                        return [2, message.channel.send("Can't find any **muted** role, stop abusing now")];
                    }
                    if (unmute) {
                        if (user.roles.cache.has(role.id)) {
                            return [2, new voteunmute_1.VoteUnmute(user, message.channel, bot, {
                                    reason: reason || undefined,
                                    timer: bot.config.mute.timer
                                }).vote()];
                        }
                        else {
                            return [2, message.channel.send("User **".concat(user.user.tag, "** is not muted so ignoring"))];
                        }
                    }
                    if (recentmutes.has(user.id)) {
                        return [2, message.channel.send("User **".concat(user.user.tag, "** was recently abused, please refrain yourself"))];
                    }
                    if (user.roles.cache.has(role.id)) {
                        return [2, message.channel.send("User **".concat(user.user.tag, "** is already muted, give them a break will ya"))];
                    }
                    if (user.roles.highest.comparePositionTo(role) > 0) {
                        return [2, message.channel.send("User **".concat(user.user.tag, "** is too powerful, can't abuse them"))];
                    }
                    new votemute_1.VoteMute(user, message.channel, bot, {
                        reason: reason || undefined,
                        timer: bot.config.mute.timer
                    }).vote();
                    return [2];
            }
        });
    });
}
function VM(message, args, bot) {
    VoteSomebody(message, args, bot);
}
exports.VM = VM;
function VUM(message, args, bot) {
    VoteSomebody(message, args, bot, true);
}
exports.VUM = VUM;
