"use strict";
exports.__esModule = true;
exports.Logger = void 0;
var chalk = require("chalk");
var Logger = (function () {
    function Logger() {
        var _this = this;
        this.time = new Date().toLocaleString();
        this.debug = function (msg) {
            console.log("".concat(chalk.gray("[".concat(_this.time, " - DEBUG] ").concat(msg))));
        };
        this.log = function (msg) {
            console.log("[".concat(_this.time, " - INFO] ").concat(msg));
        };
        this.warn = function (msg) {
            console.log("".concat(chalk.yellow("[".concat(_this.time, " - WARN] ").concat(msg))));
        };
        this.error = function (msg) {
            console.log("".concat(chalk.red("[".concat(_this.time, " - ERROR] ").concat(msg))));
        };
    }
    return Logger;
}());
exports.Logger = Logger;
