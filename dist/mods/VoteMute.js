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
var vote_1 = require("./vote");
var VoteMute = (function (_super) {
    __extends(VoteMute, _super);
    function VoteMute() {
        return _super.call(this, {
            name: "VoteMute",
            author: "acayrin",
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            ],
            command: "votemute",
            aliases: ["vm"],
            description: "Vote mute somebody cuz democracy is kul",
            usage: "%prefix%<command/alias> <mention>[/<user id>/<username>] [reason]",
            events: {
                onMsgCreate: vote_1.VM
            }
        }) || this;
    }
    return VoteMute;
}(SucklessMod_1.SucklessMod));
exports["default"] = VoteMute;
