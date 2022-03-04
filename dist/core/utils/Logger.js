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
exports.__esModule = true;
exports.Logger = void 0;
var clc = __importStar(require("colors-cli"));
var Logger = (function () {
    function Logger() {
        this.debug = function (msg) {
            console.log("".concat(clc.x246("[".concat(new Date().toLocaleString(), " - DEBUG] ").concat(msg))));
        };
        this.log = function (msg) {
            console.log("[".concat(new Date().toLocaleString(), " - INFO] ").concat(msg));
        };
        this.warn = function (msg) {
            console.log("".concat(clc.yellow("[".concat(new Date().toLocaleString(), " - WARN] ").concat(msg))));
        };
        this.error = function (msg) {
            console.log("".concat(clc.red("[".concat(new Date().toLocaleString(), " - ERROR] ").concat(msg))));
        };
    }
    return Logger;
}());
exports.Logger = Logger;
