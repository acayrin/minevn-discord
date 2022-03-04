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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.__random = exports.__all = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var Endpoints_1 = require("./Endpoints");
exports.__all = [];
Object.keys(Endpoints_1.__tags).forEach(function (key) {
    return Endpoints_1.__tags[key].forEach(function (tag) {
        if (!exports.__all.includes(tag))
            exports.__all.push(tag);
    });
});
var __random = function (what) { return __awaiter(void 0, void 0, void 0, function () {
    var from, url, tag, img, _a, _b, e_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                from = [];
                if (what)
                    Object.keys(Endpoints_1.__tags).forEach(function (url) {
                        if (Endpoints_1.__tags[url].includes(what))
                            from.push(url);
                    });
                url = what
                    ? from[Math.floor(Math.random() * from.length)]
                    : Object.keys(Endpoints_1.__tags)[Math.floor(Math.random() * Object.keys(Endpoints_1.__tags).length)];
                tag = what !== null && what !== void 0 ? what : Endpoints_1.__tags[url][Math.floor(Math.random() * Endpoints_1.__tags[url].length)];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                _b = (_a = JSON).parse;
                return [4, (0, node_fetch_1["default"])("".concat(url).concat(tag))];
            case 2: return [4, (_c.sent()).text()];
            case 3:
                img = _b.apply(_a, [_c.sent()]);
                return [2, img["url"] || img["image"]];
            case 4:
                e_1 = _c.sent();
                return [2, undefined];
            case 5: return [2];
        }
    });
}); };
exports.__random = __random;
