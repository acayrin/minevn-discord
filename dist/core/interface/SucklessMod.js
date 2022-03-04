"use strict";
exports.__esModule = true;
exports.SucklessMod = void 0;
var SucklessMod = (function () {
    function SucklessMod(options) {
        var _a, _b, _c, _d;
        this.disabled = options.disabled;
        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
        this.author = options.author;
        this.intents = options.intents;
        this.command = options.command;
        this.aliases = options.aliases;
        this.onInit = (_a = options.events) === null || _a === void 0 ? void 0 : _a.onInit;
        this.onMsgCreate = (_b = options.events) === null || _b === void 0 ? void 0 : _b.onMsgCreate;
        this.onMsgUpdate = (_c = options.events) === null || _c === void 0 ? void 0 : _c.onMsgUpdate;
        this.onMsgDelete = (_d = options.events) === null || _d === void 0 ? void 0 : _d.onMsgDelete;
    }
    return SucklessMod;
}());
exports.SucklessMod = SucklessMod;
