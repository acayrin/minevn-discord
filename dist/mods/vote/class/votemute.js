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
exports.VoteMute = void 0;
var utils_1 = require("../../../core/utils");
var recentmutes = __importStar(require("../recentmute"));
var vote_1 = require("./vote");
var VoteMute = (function (_super) {
    __extends(VoteMute, _super);
    function VoteMute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VoteMute.prototype.vote = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._run({
                    embed: this._embed().setTitle("Mute: ".concat(this.target.user.tag, " for ").concat(this._bot.config.mute.duration, "m"))
                });
                return [2];
            });
        });
    };
    VoteMute.prototype._onWin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var role;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, utils_1.getRole)(this._bot.config.mute.role || "mute", this.channel.guild)];
                    case 1:
                        role = _a.sent();
                        this.msg.edit({
                            embeds: [
                                this._embed()
                                    .setTitle("Muted: ".concat(this.target.user.tag, " [").concat(this._bot.config.mute.duration, "m]"))
                                    .setDescription("reason: ".concat(this.reason, "\namount ").concat(this._vote_Y, " \uD83D\uDC4D : ").concat(this._vote_N, " \uD83D\uDC4E")),
                            ]
                        });
                        this.target.roles
                            .add(role)["catch"](function (e) {
                            return _this.channel.send("User **".concat(_this.target.user.tag, "** can't be abused cuz they ran away like a wimp"));
                        })
                            .then(function () {
                            recentmutes.add(_this.target.id);
                            setTimeout(function () {
                                recentmutes.remove(_this.target.id);
                            }, _this._bot.config.mute.duration * 3 * 60000);
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    if (this.target.roles.cache.has(role.id)) {
                                        this.target.roles
                                            .remove(role)
                                            .then(function () {
                                            if (_this._bot.debug)
                                                _this._bot.logger.debug("[Vote - ".concat(_this.id, "] Unmuted user ").concat(_this.target.id));
                                        })["catch"](function (e) {
                                            _this._bot.logger.debug("[Vote - ".concat(_this.id, "] Can't remove muted role from user ").concat(_this.target.id, ", error ").concat(e));
                                        });
                                    }
                                    else {
                                        if (this._bot.debug)
                                            this._bot.logger.debug("[Vote - ".concat(this.id, "] User ").concat(this.target.id, " got their muted role removed, ignoring"));
                                    }
                                    return [2];
                                });
                            }); }, _this._bot.config.mute.duration * 60000);
                        });
                        return [2];
                }
            });
        });
    };
    return VoteMute;
}(vote_1.Vote));
exports.VoteMute = VoteMute;
