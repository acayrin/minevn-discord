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
exports.vPlaylist = exports.vVideo = exports.timeFormat = exports.toSecs = exports.parseVideo = exports.parsePlaylist = exports.search = void 0;
var musictrack_1 = require("./class/musictrack");
var ytsr = require("ytsr");
var ytdl = require("ytdl-core");
var ytpl = require("ytpl");
function search(query, author) {
    return __awaiter(this, void 0, void 0, function () {
        var f1, f2, yt, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ytsr.getFilters(query)];
                case 1:
                    f1 = _a.sent();
                    f2 = f1.get("Type").get("Video");
                    return [4, ytsr(f2.url, { limit: 15 })];
                case 2:
                    yt = _a.sent();
                    res = [];
                    yt.items.forEach(function (item) {
                        try {
                            res.push(new musictrack_1.MusicTrack(item["title"], item["url"], toSecs(item["duration"]), item["author"]["name"], author));
                        }
                        catch (_a) { }
                    });
                    return [2, res];
            }
        });
    });
}
exports.search = search;
function parsePlaylist(url, member) {
    return __awaiter(this, void 0, void 0, function () {
        var get, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ytpl(url)];
                case 1:
                    get = _a.sent();
                    res = [];
                    get.items.forEach(function (item) {
                        res.push(new musictrack_1.MusicTrack(item.title, item.shortUrl, item.durationSec, item.author.name, member));
                    });
                    return [2, res];
            }
        });
    });
}
exports.parsePlaylist = parsePlaylist;
function parseVideo(url, member) {
    return __awaiter(this, void 0, void 0, function () {
        var get;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ytdl.getBasicInfo(url)];
                case 1:
                    get = (_a.sent()).videoDetails;
                    return [2, new musictrack_1.MusicTrack(get.title, get.video_url, Number(get.lengthSeconds), get.author.name, member)];
            }
        });
    });
}
exports.parseVideo = parseVideo;
function toSecs(input) {
    var arr = input.split(":");
    var ss = Number(arr.pop());
    var mm = arr.length > 0 ? Number(arr.pop()) * 60 : 0;
    var hh = arr.length > 0 ? Number(arr.pop()) * 3600 : 0;
    return ss + mm + hh;
}
exports.toSecs = toSecs;
function timeFormat(number) {
    var ss = Math.floor((Number(number) / 1) % 60);
    var mm = Math.floor((Number(number) / 60) % 60);
    var hh = Math.floor((Number(number) / 3600) % 60);
    return "".concat(hh > 0 ? "".concat(hh, ":") : "").concat(mm.toString().padStart(2, "0"), ":").concat(ss.toString().padStart(2, "0"));
}
exports.timeFormat = timeFormat;
function vVideo(input) {
    return ytdl.validateURL(input);
}
exports.vVideo = vVideo;
function vPlaylist(input) {
    return ytpl.validateID(input);
}
exports.vPlaylist = vPlaylist;
