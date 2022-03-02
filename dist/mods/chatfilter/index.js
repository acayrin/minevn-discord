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
exports.chatfilter = void 0;
var discord_js_1 = require("discord.js");
var filter_1 = require("./filter");
var preload_1 = require("./preload");
var webhook_1 = require("./webhook");
var chatfilter = (function () {
    function chatfilter() {
        this.__filter = undefined;
        this.__list = undefined;
    }
    ;
    chatfilter.prototype.makeThisChatClean = function (message, args, bot) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, webhook, __d_start;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (message.author.bot)
                            return [2];
                        if (!!this.__list) return [3, 2];
                        _a = this;
                        return [4, preload_1.preload.loadDB("https://raw.githubusercontent.com/minhquantommy/CircusBot/main/badwords.json")];
                    case 1:
                        _a.__list = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.__filter = new filter_1.filter(this.__list);
                        return [4, (new webhook_1.whook(bot, message.channel)).getHook()];
                    case 3:
                        webhook = _b.sent();
                        __d_start = Date.now();
                        this.__filter.adv_replace(message.content).then(function (out) {
                            var _a, _b;
                            if (out[0] !== message.content) {
                                var atc = message.attachments;
                                webhook.send({
                                    content: out[0],
                                    username: ((_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) || message.author.username,
                                    avatarURL: ((_b = message.member) === null || _b === void 0 ? void 0 : _b.avatarURL()) || message.author.avatarURL(),
                                    embeds: [
                                        new discord_js_1.MessageEmbed()
                                            .setColor(0xf5f5f5)
                                            .setDescription("*Lưu ý: Sử dụng từ ngữ không hợp lệ quá nhiều sẽ khiến bạn bị mút!*")
                                            .setFooter("".concat(bot.cli().user.tag, " :: bad [").concat(out[1], "] - cks [").concat(out[2], "] - time [").concat(Date.now() - __d_start, "ms]"), bot.cli().user.avatarURL())
                                    ].concat(message.embeds),
                                    files: atc
                                })["finally"](function () { return message["delete"](); });
                            }
                            ;
                        });
                        return [2];
                }
            });
        });
    };
    ;
    return chatfilter;
}());
exports.chatfilter = chatfilter;
1;
