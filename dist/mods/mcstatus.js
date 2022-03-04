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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var discord_js_1 = require("discord.js");
var node_fetch_1 = __importDefault(require("node-fetch"));
module.exports = {
    name: "MinecraftServerStatus",
    author: "acayrin",
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
    command: ["mcstatus"],
    aliases: ["mc"],
    description: "Ping a minecraft server",
    usage: "%prefix%<command/alias> [ip] [port]",
    onMsgCreate: function (message, args, bot) { return __awaiter(void 0, void 0, void 0, function () {
        var ip, port, url;
        var _a, _b;
        return __generator(this, function (_c) {
            if (!args)
                return [2];
            ip = (_a = args.shift()) !== null && _a !== void 0 ? _a : "minevn.net";
            port = (_b = args.shift()) !== null && _b !== void 0 ? _b : 25565;
            url = "https://mcsrv.vercel.app/?ip=".concat(ip, "&port=").concat(port);
            (0, node_fetch_1["default"])(url).then(function (res) {
                return res.text().then(function (txt) { return __awaiter(void 0, void 0, void 0, function () {
                    var json, thumb, fav_url, channel, msg, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                json = JSON.parse(txt);
                                thumb = new discord_js_1.MessageAttachment(Buffer.from(json.favicon.replace("data:image/png;base64,", ""), "base64"), "thumb.png");
                                fav_url = undefined;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4, bot.cli().channels.fetch(bot.configs.get("mcstatus.json")['temp_channel'])];
                            case 2:
                                channel = _a.sent();
                                return [4, channel.send({ content: ip, files: [thumb] })];
                            case 3:
                                msg = _a.sent();
                                fav_url = msg.attachments.at(0).url;
                                return [3, 5];
                            case 4:
                                e_1 = _a.sent();
                                return [3, 5];
                            case 5:
                                ;
                                message.channel.send({
                                    embeds: [
                                        new discord_js_1.MessageEmbed()
                                            .setColor(bot.configs.get("core.json")['color'])
                                            .setTimestamp()
                                            .setTitle("".concat(json.host.toUpperCase()))
                                            .setDescription("".concat(json.description.descriptionText.replace(/§[a-z0-9]/g, "")))
                                            .setThumbnail(url + "&favicon=1")
                                            .addField("Online", "".concat(json.onlinePlayers, "/").concat(json.maxPlayers))
                                            .addField("Version", "".concat(json.version)),
                                    ]
                                });
                                return [2];
                        }
                    });
                }); })["catch"](function () {
                    message.channel.send("I wasn't able to sneak up onto **".concat(ip, ":").concat(port, "** and steal their goodies"));
                });
            });
            return [2];
        });
    }); }
};
