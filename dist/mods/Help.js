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
var Help_1 = require("./core/Help");
var discord_js_1 = require("discord.js");
var CoreHelp = (function (_super) {
    __extends(CoreHelp, _super);
    function CoreHelp() {
        return _super.call(this, {
            name: "Help page",
            author: "acayrin",
            intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
            command: "help",
            aliases: ["h"],
            description: "Bot's help page",
            usage: "%prefix%<command/alias> [args]",
            events: {
                onMsgCreate: Help_1.getHelp
            }
        }) || this;
    }
    ;
    return CoreHelp;
}(SucklessMod_1.SucklessMod));
exports["default"] = CoreHelp;
;
