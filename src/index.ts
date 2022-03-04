import { SucklessBot } from "./core/SucklessBot";

new SucklessBot({
	debug: true, // may set to "full" for DJS's debug as well
	clientOptions: {
		intents: [], // leave it empty so the bot will use what the mods require
		presence: {
			activities: [
				{
					name: "over the monkeys",
					type: "WATCHING",
				},
			],
		},
	},
}).start();
