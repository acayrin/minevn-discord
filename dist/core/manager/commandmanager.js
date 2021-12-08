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
exports.CommandManager = void 0;
var basemanager_1 = require("./basemanager");
var CommandManager = (function (_super) {
    __extends(CommandManager, _super);
    function CommandManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__links = new Map();
        _this.commands = [];
        _this.aliases = [];
        return _this;
    }
    CommandManager.prototype.register = function (mod) {
        var _this = this;
        if (Array.isArray(mod.command)) {
            mod.command.forEach(function (cmd) {
                _this.__links.set(cmd, mod);
                _this.commands.push(cmd);
            });
        }
        else {
            this.__links.set(mod.command, mod);
            this.commands.push(mod.command);
        }
        if (Array.isArray(mod.aliases)) {
            mod.aliases.forEach(function (cmd) {
                _this.__links.set(cmd, mod);
                _this.aliases.push(cmd);
            });
        }
        else {
            this.__links.set(mod.aliases, mod);
            this.aliases.push(mod.aliases);
        }
    };
    CommandManager.prototype.getMod = function (command) {
        return this.__links.get(command);
    };
    CommandManager.prototype.getCommands = function (mod) {
        return [].concat(mod.command);
    };
    CommandManager.prototype.getAliases = function (mod) {
        return [].concat(mod.aliases);
    };
    return CommandManager;
}(basemanager_1.BaseManager));
exports.CommandManager = CommandManager;
