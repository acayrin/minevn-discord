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
var AntiScam = (function (_super) {
    __extends(AntiScam, _super);
    function AntiScam() {
        return _super.call(this, {
            name: "AntiScam",
            author: "acayrin",
            intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
            description: "Remove all* messages that are possibly scam",
            usage: "none",
            events: {
                onMsgCreate: function (msg, args, bot) {
                    var _a, _b;
                    if (((_a = msg.embeds) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        var title = (_b = msg.embeds) === null || _b === void 0 ? void 0 : _b.at(0).title;
                        if ((title === null || title === void 0 ? void 0 : title.match(/free/gi)) && (title === null || title === void 0 ? void 0 : title.match(/nitro/gi)) && (title === null || title === void 0 ? void 0 : title.match(/steam/gi))) {
                            msg["delete"]().then(function () {
                                msg.channel.send("".concat(msg.author, " **YOU'RE FORBIDDEN FROM POSTING FAKE DISCORD NITRO WEBSITES!**"));
                            });
                        }
                        ;
                    }
                    ;
                }
            }
        }) || this;
    }
    ;
    return AntiScam;
}(SucklessMod_1.SucklessMod));
exports["default"] = AntiScam;
;
