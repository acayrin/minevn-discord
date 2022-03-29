"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var SucklessMod_1 = require("../core/interface/SucklessMod");
var Discord = __importStar(require("discord.js"));
var Kiwi = (function (_super) {
    __extends(Kiwi, _super);
    function Kiwi() {
        var _this = _super.call(this, {
            name: "Kiwi",
            description: "Kiwi",
            command: "kiwi",
            author: "kiwi",
            intents: [Discord.Intents.FLAGS.GUILDS],
            usage: "%prefix%kiwi",
            events: {
                onMsgCreate: function (message, args, bot) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!args)
                            return [2];
                        message.channel.send({
                            embeds: [
                                new Discord.MessageEmbed()
                                    .setTitle("Kiwi")
                                    .setImage(kiwis[Math.floor(Math.random() * kiwis.length)])
                                    .setColor("#00cc00")
                                    .setAuthor("Kiwi"),
                            ]
                        });
                        return [2];
                    });
                }); }
            }
        }) || this;
        return _this;
    }
    return Kiwi;
}(SucklessMod_1.SucklessMod));
exports["default"] = Kiwi;
var kiwis = [
    "https://i.kym-cdn.com/photos/images/original/001/263/042/cab.jpg",
    "https://img.buzzfeed.com/buzzfeed-static/static/2017-08/16/17/tmp/buzzfeed-prod-web-04/tmp-name-2-31487-1502920343-3_dblbig.jpg?resize=1200:*",
    "https://img.buzzfeed.com/buzzfeed-static/static/2017-08/14/15/asset/buzzfeed-prod-web-04/sub-buzz-2783-1502739685-1.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
    "https://i.pinimg.com/564x/9f/58/3f/9f583fc0e800f8062fb2aa593f8b51ca.jpg",
];
