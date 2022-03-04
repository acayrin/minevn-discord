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
var discord_js_1 = require("discord.js");
var SucklessMod_1 = require("../core/interface/SucklessMod");
var snipe_1 = require("./snipe/");
var Snipe = (function (_super) {
    __extends(Snipe, _super);
    function Snipe() {
        return _super.call(this, {
            name: "Snipe",
            author: "acayrin",
            intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
            command: ["snipe", "editsnipe", "clear"],
            aliases: ["s", "es"],
            description: "Snipe somebody and make their day miserable",
            usage: "%prefix%<command/alias> [step]",
            events: {
                onMsgCreate: snipe_1.SnipeCreate,
                onMsgDelete: snipe_1.SnipeDelete,
                onMsgUpdate: snipe_1.SnipeUpdate
            }
        }) || this;
    }
    ;
    return Snipe;
}(SucklessMod_1.SucklessMod));
exports["default"] = Snipe;
;
