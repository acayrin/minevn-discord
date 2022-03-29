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
exports.__esModule = true;
var SucklessMod_1 = require("../core/interface/SucklessMod");
var discord_js_1 = require("discord.js");
var chatfilter_1 = require("./chatfilter/");
var cf = new chatfilter_1.chatfilter();
var ChatFilter = (function (_super) {
    __extends(ChatFilter, _super);
    function ChatFilter() {
        return _super.call(this, {
            name: "ChatFilter",
            author: "acayrin",
            intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
            description: "Filter bad words",
            usage: "%prefix%<command/alias> [args]",
            priority: -1,
            events: {
                onInit: function (bot) { return cf.load(bot.configs.get("chatfilter.json")["url"]); },
                onMsgCreate: function (message, args, bot) { return cf.makeThisChatClean(message, bot); },
                onMsgUpdate: function (oldMsg, newMsg, bot) { return cf.makeThisChatClean(newMsg, bot); }
            }
        }) || this;
    }
    return ChatFilter;
}(SucklessMod_1.SucklessMod));
exports["default"] = ChatFilter;
