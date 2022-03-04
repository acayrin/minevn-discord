"use strict";
exports.__esModule = true;
exports.has = exports.remove = exports.add = void 0;
var recentmutes = [];
function add(user) {
    recentmutes.push(user);
}
exports.add = add;
function remove(user) {
    recentmutes.splice(recentmutes.indexOf(user), 1);
}
exports.remove = remove;
function has(user) {
    return recentmutes.find(function (mute) { return mute.includes(user); }) ? true : false;
}
exports.has = has;
