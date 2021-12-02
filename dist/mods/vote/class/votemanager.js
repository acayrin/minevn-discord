"use strict";
exports.__esModule = true;
exports.VoteManager = void 0;
var VoteManager = (function () {
    function VoteManager(bot) {
        this.sessions = [];
        this.bot = undefined;
        this.bot = bot;
    }
    VoteManager.prototype.add = function (session) {
        this.sessions.push(session);
        if (this.bot && this.bot.debug)
            this.bot.logger.debug("[VoteManager] Added Vote #".concat(session.id, " to the list"));
    };
    VoteManager.prototype.remove = function (session) {
        this.sessions.splice(this.sessions.indexOf(session), 1);
        if (this.bot && this.bot.debug)
            this.bot.logger.debug("[VoteManager] Removed Vote #".concat(session.id, " from the list"));
    };
    VoteManager.prototype.getSession = function (id) {
        if (id) {
            return [this.sessions.find(function (session) { return session.id.includes(id); })];
        }
        return this.sessions;
    };
    return VoteManager;
}());
exports.VoteManager = VoteManager;
