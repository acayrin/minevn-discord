"use strict";
exports.__esModule = true;
exports.MusicTrack = void 0;
var MusicTrack = (function () {
    function MusicTrack(name, url, duration, channel, requester) {
        this.name = name;
        this.url = url;
        this.duration = duration;
        this.channel = channel;
        this.requester = requester;
    }
    return MusicTrack;
}());
exports.MusicTrack = MusicTrack;
