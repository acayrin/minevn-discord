import { Bot } from './core/bot'

new Bot({
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
}).start()