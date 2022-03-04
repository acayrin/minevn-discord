# MineVN discord bot

A suckass bot mainly used in MineVN's Discord server

This project was made mainly for fun, and for the purpose of learning Typescript (~~why when i could just stick with java instead~~)

## Current features

-   Vote system - vote (un)mute someone (with anti-spam, channel lock and vote cooldown)
-   Message snipe - snipe a deleted/modified message (with full file support and custom history lookup)
-   Minecraft status - a simple minecraft server tracker (Hẻo đã hẻo)
-   Random weeb shit - send random images from nekos.fun/nekos.life
-   Music player - a simple, suckass youtube audio player but it works out of the box (keep getting hit with rate-limits tho)
-	Chat filtering - a fast chat filtering system (less than 3 seconds on lengthy messages)
-   To be added:
    -   basic moderation features? most likely no
    -   full size minecraft server tracker?
    -   credit syste- wait wut
    -   image options??? wtf does that even mean
    -   clowns - we need happiness

## Requirements

-   NodeJS `16.x and above`
-   Knowledge about Typescript/Javascript
-   Time to rethink about the purpose of this thing that i made

## Installation and Usage

```
yarn            // install dependencies [or npm i]
yarn build      // compile the project (optional) [or npm run build]
yarn start      // start the bot [or npm start]
```

## Configuration

Configurations are stored in the `config` folder

To get a config object (JSON), you'll need to call the `configs` variable from a `SucklessBot` object then get it using a valid config file name

as example
```JS
Suckless.configs.get(<config_file.json>)['some_json_key']
```

Core configuration is stored in ``core.json``, this is where you set your bot token, prefix, embed color, etc.

## Creating a mod

Simply create your mod logics and put them inside the `mods` folder, then create a default export class file to declare your mod to be hooked up (extending `SucklessMod` object)

## Example

### `mods/Ping.ts`

```ts
import { Intents, Message } from "discord.js";
import { SucklessBot } from "../core/SucklessBot";
import { SucklessMod } from "../core/interface/SucklessMod";

export default class Ping extends SucklessMod {
	constructor() {
		super({
			name: "Ping",
			author: "acayrin",
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
			command: ["ping"],
			aliases: ["p"],
			description: "Simple ping pong!",
			usage: "%prefix%<command/alias>",
			events: {
				onMsgCreate: (msg: Message, args: string[], bot: SucklessBot) => {
					if (msg.content === "Ping") {
						msg.reply({
							content: "Pong!"
						});
					};
				}
			}
		});
	};
};

```

You may find more "interest" things inside the `mods` folder

## Todos

-   ~~custom configs~~
-   more events
-   idk, more random mods
-   make it sucks less
