"use strict";
exports.__esModule = true;
exports.Logger = void 0;
var chalk = require("chalk");
var Logger = (function () {
    function Logger() {
        this.debug = function (msg) {
            console.log("".concat(chalk.gray("[".concat(new Date().toLocaleString(), " - DEBUG] ").concat(msg))));
        };
        this.log = function (msg) {
            console.log("[".concat(new Date().toLocaleString(), " - INFO] ").concat(msg));
        };
        this.warn = function (msg) {
            console.log("".concat(chalk.yellow("[".concat(new Date().toLocaleString(), " - WARN] ").concat(msg))));
        };
        this.error = function (msg) {
            console.log("".concat(chalk.red("[".concat(new Date().toLocaleString(), " - ERROR] ").concat(msg))));
        };
    }
    return Logger;
}());
exports.Logger = Logger;
