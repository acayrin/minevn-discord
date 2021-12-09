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
exports.__esModule = true;
exports.VoteManager = void 0;
var basemanager_1 = require("../../../core/manager/basemanager");
var VoteManager = (function (_super) {
    __extends(VoteManager, _super);
    function VoteManager(bot) {
        var _this = _super.call(this, bot) || this;
        _this.__sessions = [];
        return _this;
    }
    VoteManager.prototype.add = function (session) {
        var _a;
        this.__sessions.push(session);
        (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[VoteManager] Added Vote #".concat(session.id, " to the list"));
    };
    VoteManager.prototype.remove = function (session) {
        var _a;
        this.__sessions.splice(this.__sessions.indexOf(session), 1);
        (_a = this.__bot) === null || _a === void 0 ? void 0 : _a.emit("debug", "[VoteManager] Removed Vote #".concat(session.id, " from the list"));
    };
    VoteManager.prototype.getSession = function (id) {
        return id ? [this.__sessions.find(function (session) { return session.id.includes(id); })] : this.__sessions;
    };
    return VoteManager;
}(basemanager_1.BaseManager));
exports.VoteManager = VoteManager;
