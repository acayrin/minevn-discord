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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.SucklessBot = void 0;
var Discord = __importStar(require("discord.js"));
var events_1 = require("events");
var fs = __importStar(require("fs"));
var path_1 = require("path");
var CommandManager_1 = require("./manager/CommandManager");
var Logger_1 = require("./utils/Logger");
var path = (0, path_1.dirname)(require.main.filename);
var SucklessBot = (function (_super) {
    __extends(SucklessBot, _super);
    function SucklessBot(options) {
        var _this = _super.call(this) || this;
        _this.debug = false;
        _this.cmdMgr = new CommandManager_1.CommandManager();
        _this.logger = new Logger_1.Logger();
        _this.configs = new Discord.Collection();
        _this.mods = [];
        _this.cli = function () { return _this.__client; };
        _this.__init = function () {
            _this.logger.log("===================== Suckless Bot =====================");
            _this.logger.log("Platform ".concat(process.platform, " ").concat(process.arch, " - Node ").concat(process.version.match(/^v(\d+\.\d+)/)[1]));
            fs.readdirSync("".concat(path, "/../config")).forEach(function (name) {
                if (!name.endsWith(".json"))
                    return;
                var obj = JSON.parse(fs.readFileSync("".concat(path, "/../config/").concat(name), "utf-8"));
                _this.configs.set(name, obj);
                _this.logger.log("[CONFIGURATION] Loaded config file \"".concat(name, "\""));
            });
            var intents = [];
            fs.readdirSync("".concat(path, "/mods")).forEach(function (item) {
                var _a, _b;
                if (!item.endsWith(".js"))
                    return;
                var mod = undefined;
                try {
                    mod = new (require("".concat(path, "/mods/").concat(item))["default"])();
                }
                catch (e) {
                    _this.logger.error("[LOADER] Failed to load mod \"".concat(item, "\"\n").concat(e));
                    return;
                }
                if (mod.disabled)
                    return;
                mod.intents.forEach(function (intent) {
                    if (!intents.includes(intent))
                        intents.push(intent);
                });
                _this.cmdMgr.register(mod);
                _this.mods.push(mod);
                if (mod.onInit)
                    try {
                        mod.onInit(_this);
                    }
                    catch (e) {
                        _this.logger.error("[".concat(mod.name, "] ").concat(e, "\n").concat(e.stack));
                    }
                _this.logger.log("[LOADER] Loaded mod: ".concat(mod.name, " (").concat(item, ")"));
                if (mod.aliases)
                    _this.logger.log("- ".concat(mod.name, " registered Aliases: ").concat((_a = mod.aliases) === null || _a === void 0 ? void 0 : _a.toString()));
                _this.logger.log("- ".concat(mod.name, " registered Commands: ").concat((_b = mod.command) === null || _b === void 0 ? void 0 : _b.toString()));
                _this.logger.log("- ".concat(mod.name, " requested Intents: ").concat(mod.intents));
            });
            if (_this.__clientOptions.intents.toString() !== "")
                intents = _this.__clientOptions.intents;
            _this.logger.log("Requested Intents: ".concat(intents));
            _this.logger.log("Allowed Intents: ".concat(intents, " ").concat(_this.__clientOptions.intents.toString() !== "" ? "(as in SucklessBot options)" : "(from mods)"));
            _this.__client = new Discord.Client(Object.assign({}, _this.__clientOptions, { intents: intents }));
            _this.mods.sort(function (m1, m2) {
                return m2.priority - m1.priority;
            });
            _this.logger.log("Mods priority (execution order):");
            _this.mods.forEach(function (m) { return _this.logger.log("[".concat(m.priority, "] ").concat(m.name)); });
        };
        _this.__onConnect = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.logger.log("SucklessBot connected as ".concat(this.__client.user.tag));
                return [2];
            });
        }); };
        _this.__onMessage = function (message) { return __awaiter(_this, void 0, void 0, function () {
            var msg, arg, cmd, mod_1, i_1, x;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msg = message.content.replace(this.configs.get("core.json")["prefix"], "").trim();
                        arg = msg.split(/ +/);
                        cmd = arg.shift().toLocaleLowerCase();
                        if (!(message.content.startsWith(this.configs.get("core.json")["prefix"]) && this.cmdMgr.getMod(cmd))) return [3, 1];
                        mod_1 = this.cmdMgr.getMod(cmd);
                        if (mod_1.onMsgCreate)
                            mod_1.onMsgCreate(message, arg, this)["catch"](function (e) { return _this.logger.error("[".concat(mod_1.name, "] ").concat(e, "\n").concat(e.stack)); });
                        return [3, 5];
                    case 1:
                        i_1 = -1;
                        _a.label = 2;
                    case 2:
                        if (!(++i_1 < this.mods.length)) return [3, 5];
                        if (!this.mods[i_1].onMsgCreate) return [3, 4];
                        return [4, this.mods[i_1]
                                .onMsgCreate(message, undefined, this)["catch"](function (e) { return _this.logger.error("[".concat(_this.mods[i_1].name, "] ").concat(e, "\n").concat(e.stack)); })];
                    case 3:
                        x = _a.sent();
                        if (x && this.mods[i_1].single)
                            return [3, 5];
                        _a.label = 4;
                    case 4: return [3, 2];
                    case 5: return [2];
                }
            });
        }); };
        _this.__onDelete = function (message) { return __awaiter(_this, void 0, void 0, function () {
            var i, x;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = -1;
                        _a.label = 1;
                    case 1:
                        if (!(++i < this.mods.length)) return [3, 4];
                        if (!this.mods[i].onMsgDelete) return [3, 3];
                        return [4, this.mods[i]
                                .onMsgDelete(message, undefined, this)["catch"](function (e) { return _this.logger.error("[".concat(_this.mods[i].name, "] ").concat(e, "\n").concat(e.stack)); })];
                    case 2:
                        x = _a.sent();
                        if (x && this.mods[i].single)
                            return [3, 4];
                        _a.label = 3;
                    case 3: return [3, 1];
                    case 4: return [2];
                }
            });
        }); };
        _this.__onUpdate = function (oldMessage, newMessage) { return __awaiter(_this, void 0, void 0, function () {
            var i, x;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = -1;
                        _a.label = 1;
                    case 1:
                        if (!(++i < this.mods.length)) return [3, 4];
                        if (!this.mods[i].onMsgUpdate) return [3, 3];
                        return [4, this.mods[i]
                                .onMsgUpdate(oldMessage, newMessage, this)["catch"](function (e) { return _this.logger.error("[".concat(_this.mods[i].name, "] ").concat(e, "\n").concat(e.stack)); })];
                    case 2:
                        x = _a.sent();
                        if (x && this.mods[i].single)
                            return [3, 4];
                        _a.label = 3;
                    case 3: return [3, 1];
                    case 4: return [2];
                }
            });
        }); };
        _this.debug = options.debug;
        _this.__clientOptions = options.clientOptions;
        _this.on("debug", function (m) { return (_this.debug ? _this.logger.debug(m) : undefined); });
        return _this;
    }
    SucklessBot.prototype.start = function () {
        var _this = this;
        this.__init();
        this.__client.login(this.configs.get("core.json")["token"]);
        this.__client.on("ready", this.__onConnect.bind(this));
        this.__client.on("messageCreate", this.__onMessage.bind(this));
        this.__client.on("messageDelete", this.__onDelete.bind(this));
        this.__client.on("messageUpdate", this.__onUpdate.bind(this));
        if (this.debug === "full")
            this.__client.on("debug", function (e) { return _this.logger.debug(e); });
    };
    return SucklessBot;
}(events_1.EventEmitter));
exports.SucklessBot = SucklessBot;
