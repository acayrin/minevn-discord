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
var weaboo_1 = require("./weaboo/");
var Weaboo = (function (_super) {
    __extends(Weaboo, _super);
    function Weaboo() {
        return _super.call(this, {
            name: "WeabooForLife",
            description: "Get some random anime pics\ntho some tags may have limited amount of pics (dont' blame me)",
            usage: "%prefix%<command/alias> [tag]",
            command: ["wibu"],
            aliases: ["wb"],
            intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
            events: {
                onMsgCreate: weaboo_1.SendImg
            }
        }) || this;
    }
    ;
    return Weaboo;
}(SucklessMod_1.SucklessMod));
exports["default"] = Weaboo;
;
