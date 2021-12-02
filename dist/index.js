"use strict";
exports.__esModule = true;
var sucklessbot_1 = require("./core/class/sucklessbot");
new sucklessbot_1.SucklessBot({
    debug: true,
    clientOptions: {
        intents: [],
        presence: {
            activities: [
                {
                    name: "over the people",
                    type: "WATCHING"
                },
            ]
        }
    }
}).start();
