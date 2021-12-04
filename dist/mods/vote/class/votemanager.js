"use strict";
exports.__esModule = true;
exports.VoteManager = void 0;
var VoteManager = (function () {
    function VoteManager(bot) {
        this.__sessions = [];
        this.__bot = undefined;
        this.__bot = bot;
    }
    VoteManager.prototype.add = function (session) {
        this.__sessions.push(session);
        if (this.__bot && this.__bot.debug)
            this.__bot.logger.debug("[VoteManager] Added Vote #".concat(session.id, " to the list"));
    };
    VoteManager.prototype.remove = function (session) {
        this.__sessions.splice(this.__sessions.indexOf(session), 1);
        if (this.__bot && this.__bot.debug)
            this.__bot.logger.debug("[VoteManager] Removed Vote #".concat(session.id, " from the list"));
    };
    VoteManager.prototype.getSession = function (id) {
        if (id) {
            return [this.__sessions.find(function (session) { return session.id.includes(id); })];
        }
        return this.__sessions;
    };
    return VoteManager;
}());
exports.VoteManager = VoteManager;
