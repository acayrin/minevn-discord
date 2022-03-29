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
var Database_1 = require("./Database");
var Filter_1 = require("./Filter");
var Webhook_1 = require("./Webhook");
var chatfilter = (function () {
    function chatfilter(url) {
        var _this = this;
        this.__filter = undefined;
        if (url)
            Database_1.database.loadDB(url).then(function (db) { return (_this.__filter = new Filter_1.filter(db)); });
    }
    chatfilter.prototype.load = function (url) {
        var _this = this;
        Database_1.database.loadDB(url).then(function (db) { return (_this.__filter = new Filter_1.filter(db)); });
    };
    chatfilter.prototype.makeThisChatClean = function (message, bot) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var __d_start, out, rep_embed, rep, e_1, payload_embeds_1, payload_attachments_1, ovf, payload_content_1, webhook_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (message.author.bot ||
                            !message.channel.isText() ||
                            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g.test(message.content))
                            return [2];
                        __d_start = Date.now();
                        return [4, this.__filter.adv_replace(message.content)];
                    case 1:
                        out = _c.sent();
                        if (!(out[0] !== message.content)) return [3, 7];
                        rep_embed = undefined;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4, message.channel.messages.fetch(message.reference.messageId)];
                    case 3:
                        rep = _c.sent();
                        rep_embed = new discord_js_1.MessageEmbed()
                            .setColor(bot.configs.get("core.json")["color"])
                            .setAuthor((((_a = rep.member) === null || _a === void 0 ? void 0 : _a.nickname) || rep.author.username) + " (click to move)", ((_b = rep.member) === null || _b === void 0 ? void 0 : _b.avatarURL()) || rep.author.avatarURL(), rep.url)
                            .setDescription(rep.content)
                            .setFooter("L\u01B0u \u00FD: S\u1EED d\u1EE5ng t\u1EEB ng\u1EEF kh\u00F4ng h\u1EE3p l\u1EC7 qu\u00E1 nhi\u1EC1u s\u1EBD khi\u1EBFn b\u1EA1n b\u1ECB m\u00FAt! [".concat(out[1], " - ").concat(Date.now() - __d_start, "ms]"));
                        return [3, 5];
                    case 4:
                        e_1 = _c.sent();
                        return [3, 5];
                    case 5:
                        payload_embeds_1 = message.embeds;
                        if (rep_embed) {
                            payload_embeds_1.push(rep_embed);
                        }
                        else {
                            payload_embeds_1.push(new discord_js_1.MessageEmbed()
                                .setColor(bot.configs.get("core.json")["color"])
                                .setFooter("L\u01B0u \u00FD: S\u1EED d\u1EE5ng t\u1EEB ng\u1EEF kh\u00F4ng h\u1EE3p l\u1EC7 qu\u00E1 nhi\u1EC1u s\u1EBD khi\u1EBFn b\u1EA1n b\u1ECB m\u00FAt! [".concat(out[1], " - ").concat(Date.now() - __d_start, "ms]")));
                        }
                        payload_attachments_1 = Array.from(message.attachments.values());
                        ovf = out[0].length > 2000 ? new discord_js_1.MessageAttachment(Buffer.from(out[0], "utf-8"), "out.txt") : undefined;
                        if (ovf)
                            payload_attachments_1.push(ovf);
                        payload_content_1 = ovf ? "*Tin nhắn đã được chuyển sang dạng file vì quá dài.*" : out[0];
                        return [4, new Webhook_1.whook(bot, message.channel).getHook()];
                    case 6:
                        webhook_1 = _c.sent();
                        return [2, message["delete"]()["finally"](function () {
                                var _a, _b;
                                return webhook_1.send({
                                    content: payload_content_1,
                                    username: ((_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) || message.author.username,
                                    avatarURL: ((_b = message.member) === null || _b === void 0 ? void 0 : _b.avatarURL()) || message.author.avatarURL(),
                                    embeds: payload_embeds_1,
                                    files: payload_attachments_1
                                });
                            })];
                    case 7: return [2];
                }
            });
        });
    };
    return chatfilter;
}());
exports.chatfilter = chatfilter;
