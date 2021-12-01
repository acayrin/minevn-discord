"use strict";
exports.__esModule = true;
exports.CommandManager = void 0;
var discord_js_1 = require("discord.js");
var CommandManager = (function () {
    function CommandManager() {
        this.links = new discord_js_1.Collection();
        this.commands = [];
        this.aliases = [];
    }
    CommandManager.prototype.register = function (mod) {
        var _this = this;
        if (Array.isArray(mod.command)) {
            mod.command.forEach(function (cmd) {
                _this.links.set(cmd, mod);
                _this.commands.push(cmd);
            });
        }
        else {
            this.links.set(mod.command, mod);
            this.commands.push(mod.command);
        }
        if (Array.isArray(mod.aliases)) {
            mod.aliases.forEach(function (cmd) {
                _this.links.set(cmd, mod);
                _this.aliases.push(cmd);
            });
        }
        else {
            this.links.set(mod.aliases, mod);
            this.aliases.push(mod.aliases);
        }
    };
    CommandManager.prototype.get = function (command) {
        if (!command)
            return null;
        return this.links.get(command);
    };
    CommandManager.prototype.getCommands = function (mod) {
        return [].concat(mod.command);
    };
    CommandManager.prototype.getAliases = function (mod) {
        return [].concat(mod.aliases);
    };
    return CommandManager;
}());
exports.CommandManager = CommandManager;
