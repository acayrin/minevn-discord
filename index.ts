import { Bot } from "./core/class/bot";

new Bot({
    debug: true,
    clientOptions: {
        intents: [],
        presence: {
            activities: [
                {
                    name: "over the people",
                    type: "WATCHING",
                },
            ],
        },
    },
}).start();
