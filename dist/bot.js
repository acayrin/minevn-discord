"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Bot = void 0;
var Discord = require("discord.js");
var fs = require("fs");
var logger_1 = require("./logger");
var Bot = (function () {
    function Bot(token, debug) {
        var _this = this;
        this.debug = false;
        this.logger = new logger_1.Logger();
        this.config = JSON.parse(fs.readFileSync("".concat(__dirname, "/config.json"), 'utf-8'));
        this.command = new Discord.Collection();
        this.cli = function () { return _this.client; };
        this.init = function () {
            _this.logger.log("Node ".concat(process.version));
            var intents = [];
            fs.readdirSync("".concat(__dirname, "/mods")).forEach(function (item) {
                if (!item.endsWith('.js'))
                    return;
                var mod = require("".concat(__dirname, "/mods/").concat(item));
                if (!mod.command || mod.command.length === 0)
                    return _this.logger.warn("File mods/".concat(item, " is not a valid mod"));
                mod.intents.forEach(function (intent) {
                    if (!intents.includes(intent))
                        intents.push(intent);
                });
                if (mod.aliases)
                    if (Array.isArray(mod.aliases))
                        mod.aliases.forEach(function (alias) { return _this.command.set(alias, mod); });
                    else
                        _this.command.set(mod.aliases, mod);
                if (Array.isArray(mod.command))
                    mod.command.forEach(function (cmd) { return _this.command.set(cmd, mod); });
                else
                    _this.command.set(mod.command, mod);
                if (mod.onInit)
                    mod.onInit(_this);
                _this.logger.log("Loaded mod: ".concat(mod.name, " (").concat(item, ")"));
                if (_this.debug) {
                    if (mod.aliases)
                        _this.logger.debug("[STARTUP] ".concat(mod.name, " registered Aliases: ").concat(mod.aliases.toString()));
                    _this.logger.debug("[STARTUP] ".concat(mod.name, " registered Commands: ").concat(mod.command.toString()));
                    _this.logger.debug("[STARTUP] ".concat(mod.name, " requested Intents: ").concat(mod.intents));
                }
            });
            _this.logger.log("Allowed Intents: ".concat(intents));
            _this.client = new Discord.Client({ intents: intents });
        };
        this.onConnect = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.logger.log("Bot connected as ".concat(this.client.user.tag));
                return [2];
            });
        }); };
        this.onMessage = function (message) {
            var arg = message.content.split(/ +/);
            if (arg.length === 1
                || !message.content.startsWith(_this.config.prefix))
                return _this.command.forEach(function (mod) { return mod.onMsgCreate(message, null, _this); });
            arg.shift();
            var cmd = arg.shift().toLocaleLowerCase();
            if (!_this.command.has(cmd))
                return _this.command.forEach(function (mod) { return mod.onMsgCreate(message, null, _this); });
            try {
                _this.command.get(cmd).onMsgCreate(message, arg, _this);
            }
            catch (error) {
                _this.logger.error("Error while executing command '".concat(message.content, "'\n").concat(error));
            }
        };
        this.onDelete = function (message) {
            var mods = [];
            _this.command.forEach(function (mod) {
                if (!mods.includes(mod))
                    mods.push(mod);
            });
            mods.forEach(function (mod) {
                if (mod.onMsgDelete)
                    mod.onMsgDelete(message, message.content.split(/ +/), _this);
            });
        };
        this.onUpdate = function (oldMessage, newMessage) {
            var mods = [];
            _this.command.forEach(function (mod) {
                if (!mods.includes(mod))
                    mods.push(mod);
            });
            mods.forEach(function (mod) {
                if (mod.onMsgUpdate)
                    mod.onMsgUpdate(oldMessage, newMessage, _this);
            });
        };
        this.token = token || this.config.token;
        this.debug = debug;
    }
    Bot.prototype.start = function () {
        this.init();
        this.client.login(this.token);
        this.client.on('ready', this.onConnect.bind(this));
        this.client.on('messageCreate', this.onMessage.bind(this));
        this.client.on('messageDelete', this.onDelete.bind(this));
        this.client.on('messageUpdate', this.onUpdate.bind(this));
    };
    return Bot;
}());
exports.Bot = Bot;
