# A Somewhat Suckless Discord Bot

As the title said, mainly used in MineVN's Discord server

This project was made mainly for fun, and for the purpose of learning Typescript (~~why when i could just stick with java instead~~)

## Current features

-   Vote system - vote (un)mute someone (with anti-spam, channel lock and vote cooldown)
-   Message snipe - snipe a deleted/modified message (with full file support and custom history lookup)
-   Minecraft status - a simple minecraft server tracker (Hẻo đã hẻo)
-   Random weeb shit - send random images from nekos.fun/nekos.life
-   Music player - a simple, suckass youtube audio player but it works out of the box (keep getting hit with rate-limits tho)
-   To be added:
    -   basic moderation features? most likely no
    -   full size minecraft server tracker?
    -   credit syste- wait wut
    -   image options??? wtf does that even mean
    -   clowns - we need happiness

## Requirements

-   NodeJS `16.x`
-   Knowledge about Typescript/Javascript
-   Time to rethink about the purpose of this thing that i made

## Installation and Usage

```
yarn            // install dependencies [or npm i]
yarn build      // compile the project (optional) [or npm run build]
yarn start      // start the bot [or npm start]
```

## Configuration

Change `config.json.example` to `config.json`

Then edit it to suit your needs

Alternatively you can use `SUCKLESS_CONFIG` env variable with the absolute path to your config file

Currently custom configs are not supported

## Creating a mod

Simply create your mod logics and put them inside the `mods` folder, then export some required variables for the bot to hook it up

## Variables

### `name`: string

The mod's name

### `author`: string (optional)

The mod's author

### `description`: string (optional)

The mod's description

### `usage`: string

The mod's basic usage, for help messages

### `intents`: Discord.Intents[]

The mod's intents list, used to declare which intents that the mod will be using

### `command`: string | string[]

The mod's command(s), used to declare what command(s) will trigger the mod

### `aliases`: string | string[]

The mod's command alises, used to declare what shorthand command(s) will trigger the mod

### `onInit`: Function

The mod's function to use during bot setup

### `onMsgCreate`: Function

The mod's function to handle Discord messageCreate events

### `onMsgDelete`: Function

The mod's function to handle Discord messageDelete events

### `onMsgUpdate`: Function

The mod's function to handle Discord messageUpdate events

### `disabled`: boolean (optional, default: false)

Whether the mod will be disabled

## Example

### `mods/SucklessMod.ts`

```ts
export = {
	name: "Some suckless mod",
	author: "acayrin",
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
	command: "suck",
	aliases: ["sk"],
	description: "This is a mod used for demonstration only",
	usage: "%prefix% <command/alias> <mention>[/<user id>/<username>] [args]",
	onMsgCreate: SomeSucklessFunction,
};
```

### `mods/SomeSucklessFunction.ts`

```ts
export function SomeSucklessFunction(message: Discord.Message, args: string[], bot: Bot) {
    message.channel.send('This is an example);
}
```

You may find more "interest" things inside the `mods` folder

## Todos

-   custom configs
-   more events
-   idk, more random mods
-   make it sucks less
