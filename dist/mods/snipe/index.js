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
exports.SnipeUpdate = exports.SnipeDelete = exports.Snipe = void 0;
var Discord = __importStar(require("discord.js"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var record_D = {};
var record_U = {};
var Snipe = function (message, args, bot) {
    var _a, _b;
    record_D[_a = message.channelId] || (record_D[_a] = []);
    record_U[_b = message.channelId] || (record_U[_b] = []);
    if (!args)
        return;
    var arg = message.content.replace(bot.config.prefix, "").trim().split(/ +/);
    var cmd = arg.shift().toLocaleLowerCase();
    var num = -1 - Math.abs(Number(arg.shift()));
    switch (cmd) {
        case "s":
        case "snipe": {
            if (record_D[message.channelId].length < 1)
                return;
            var rep = record_D[message.channelId].at(num || -1);
            message.reply({
                embeds: [_e(rep)],
                files: rep.files || null
            });
            break;
        }
        case "es":
        case "editsnipe": {
            if (record_U[message.channelId].length < 1)
                return;
            var rep = record_U[message.channelId].at(num || -1);
            message.reply({
                embeds: [_e(rep)],
                files: rep.files || null
            });
            break;
        }
        case "clear": {
            if (message.member.permissions.has("MANAGE_MESSAGES")) {
                record_U[message.channelId].length = 0;
                record_D[message.channelId].length = 0;
                if (bot.debug)
                    bot.logger.debug("[Snipe - ".concat(message.channelId, "] Cleared local cache"));
            }
            break;
        }
        default: {
        }
    }
};
exports.Snipe = Snipe;
var SnipeDelete = function (message, args, bot) {
    var _a, _b;
    record_D[_a = message.channelId] || (record_D[_a] = []);
    record_U[_b = message.channelId] || (record_U[_b] = []);
    if (record_D[message.channelId].length > bot.config.snipe.limit)
        record_D[message.channelId].shift();
    if (bot.debug)
        bot.logger.debug("[Snipe - ".concat(message.channelId, "] Deleted +").concat(message.id, " (").concat(record_D[message.channelId].length, "/").concat(bot.config.snipe.limit, ")"));
    var files = [];
    message.attachments.forEach(function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, node_fetch_1["default"])(file.attachment.toString())];
                case 1: return [4, (_a.sent()).buffer()];
                case 2:
                    buffer = _a.sent();
                    files.push({ attachment: buffer, name: file.name });
                    return [2];
            }
        });
    }); });
    return record_D[message.channelId].push({
        id: message.id,
        content: message.content,
        files: files,
        owner: message.author.tag,
        avatar: message.author.avatarURL()
    });
};
exports.SnipeDelete = SnipeDelete;
var SnipeUpdate = function (oldMsg, newMsg, bot) {
    var _a, _b;
    record_D[_a = oldMsg.channelId] || (record_D[_a] = []);
    record_U[_b = oldMsg.channelId] || (record_U[_b] = []);
    if (record_U[oldMsg.channelId].length > bot.config.snipe.limit)
        record_U[oldMsg.channelId].shift();
    if (bot.debug)
        bot.logger.debug("[Snipe - ".concat(oldMsg.channelId, "] Updated +").concat(oldMsg.id, " (").concat(record_U[oldMsg.channelId].length, "/").concat(bot.config.snipe.limit, ")"));
    var files = [];
    oldMsg.attachments.forEach(function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, node_fetch_1["default"])(file.attachment.toString())];
                case 1: return [4, (_a.sent()).buffer()];
                case 2:
                    buffer = _a.sent();
                    files.push({ attachment: buffer, name: file.name });
                    return [2];
            }
        });
    }); });
    return record_U[oldMsg.channelId].push({
        id: oldMsg.id,
        content: oldMsg.content,
        files: files,
        owner: oldMsg.author.tag,
        avatar: oldMsg.author.avatarURL()
    });
};
exports.SnipeUpdate = SnipeUpdate;
var _e = function (a) {
    return new Discord.MessageEmbed()
        .setColor("#ed2261")
        .setAuthor(a.owner, a.avatar)
        .setDescription(a.content)
        .setTimestamp();
};
