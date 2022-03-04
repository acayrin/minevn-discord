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
var musicplayer_1 = require("./musicplayer/");
var discord_js_1 = require("discord.js");
var MusicPlayer = (function (_super) {
    __extends(MusicPlayer, _super);
    function MusicPlayer() {
        return _super.call(this, {
            name: "MusicPlayer",
            description: "A simple music player since Susan decided to killed off most of available bots",
            intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES],
            command: ["player", "youtube"],
            aliases: "yt",
            usage: "Use ``%prefix%yt`` for full usage guide",
            author: "acayrin",
            events: {
                onMsgCreate: musicplayer_1.CreatePlayer
            }
        }) || this;
    }
    ;
    return MusicPlayer;
}(SucklessMod_1.SucklessMod));
exports["default"] = MusicPlayer;
;
