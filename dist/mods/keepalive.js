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
var http = __importStar(require("http"));
module.exports = {
    name: "Keep alive",
    description: "A simple bot keep alive",
    command: "",
    author: "",
    intents: [],
    usage: "there is no usage",
    onInit: function (bot) {
        var requestListener = function (req, res) {
            res.writeHead(200);
            res.end("PING PONG!");
        };
        var server = http.createServer(requestListener);
        var port = Number(process.env.PORT) || 3333;
        var host = "localhost";
        server.listen(port, host, 0, function () {
            bot.logger.log("[KeepAlive] Started server");
        });
    }
};
