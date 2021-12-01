"use strict";
exports.__esModule = true;
var bot_1 = require("./core/bot");
new bot_1.Bot({
    debug: true,
    clientOptions: {
        intents: [],
        presence: {
            activities: [
                {
                    name: "over the people",
                    type: "WATCHING"
                }
            ]
        }
    }
}).start();
