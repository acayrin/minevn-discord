"use strict";
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
exports.filter = void 0;
var promise = __importStar(require("bluebird"));
var filter = (function () {
    function filter(list) {
        this.__list = undefined;
        this.__list = list;
    }
    ;
    filter.prototype.clear = function (input) {
        return input
            .replace(/ +/g, "")
            .replace(/\\n+/g, "")
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/[`~!@#$%^&*()_+-=[\]{};':",.\/<>?\\|]/g, '');
    };
    filter.prototype.simple_replace = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, f;
            return __generator(this, function (_b) {
                for (_i = 0, _a = this.__list; _i < _a.length; _i++) {
                    f = _a[_i];
                    input = input.replace(new RegExp(f, "gi"), "是");
                }
                return [2, input];
            });
        });
    };
    ;
    filter.prototype.adv_replace = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var split, chunks, indexes, prt, _i, indexes_1, obj, c, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        split = msg.split('');
                        chunks = this.to_chunk(split, Math.ceil(split.length / (split.length >= 1500 ? 64 :
                            split.length >= 1000 ? 32 :
                                split.length >= 500 ? 16 :
                                    split.length >= 250 ? 8 : 0)));
                        indexes = [];
                        return [4, promise.Promise.map(chunks, function (chunk, ck_index) { return __awaiter(_this, void 0, void 0, function () {
                                var ck_base_index;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            ck_base_index = chunks[0].length * ck_index;
                                            return [4, promise.Promise.map(chunk, function (char, cr_index) {
                                                    if (char === "\n" ||
                                                        char === " " ||
                                                        (/[`~!@#$%^&*()_+-=[\]{};':",.\/<>?\\|]/g).test(chunk[cr_index]) ||
                                                        (/[\u200B-\u200D\uFEFF]/g).test(chunk[cr_index]))
                                                        return;
                                                    var cf_index = cr_index;
                                                    var tmp_string = char;
                                                    while (++cf_index < chunk.length) {
                                                        if (chunk[cf_index] === "\n" ||
                                                            chunk[cf_index] === " " ||
                                                            (/[`~!@#$%^&*()_+-=[\]{};':",.\/<>?\\|]/g).test(chunk[cf_index]) ||
                                                            (/[\u200B-\u200D\uFEFF]/g).test(chunk[cf_index]))
                                                            continue;
                                                        tmp_string += chunk[cf_index];
                                                        var x = _this.__list.length;
                                                        while (--x) {
                                                            if (_this.clear(tmp_string)
                                                                .replace(/ +/g, "")
                                                                .replace(/\\n+/g, "")
                                                                .toLowerCase() === _this.__list[x].toLowerCase()) {
                                                                indexes.push([
                                                                    ck_base_index + cr_index++,
                                                                    ck_base_index + cf_index++
                                                                ]);
                                                                break;
                                                            }
                                                            ;
                                                        }
                                                        ;
                                                    }
                                                    ;
                                                }, {
                                                    concurrency: 50
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); }, {
                                concurrency: 8
                            })];
                    case 1:
                        _a.sent();
                        prt = msg.split('');
                        for (_i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
                            obj = indexes_1[_i];
                            for (c = obj[0]; c <= obj[1]; c++) {
                                prt[c] = "";
                                prt[obj[1]] = "是";
                            }
                            ;
                        }
                        ;
                        res = prt.join('');
                        return [2, [
                                res.replace(/是/g, "<:mvncat:861078127551971338>").length < 1900 ?
                                    res.replace(/是/g, "<:mvncat:861078127551971338>") :
                                    res.replace(/是/g, "❌"),
                                indexes.length,
                                chunks.length
                            ]];
                }
            });
        });
    };
    ;
    filter.prototype.to_chunk = function (arr, size) {
        if (size <= 0)
            throw "Invalid chunk size";
        var R = [];
        for (var i = 0, len = arr.length; i < len; i += size)
            R.push(arr.slice(i, i + size));
        return R;
    };
    ;
    return filter;
}());
exports.filter = filter;
;
