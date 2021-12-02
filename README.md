# A Somewhat Suckless Discord Bot

As the title, mainly used in MineVN's Discord server

This project was made mainly for fun, don't take it too serious for all the so-called jokes i put around this README kekw

## Current features

-   Vote system - vote (un)mute someone (with anti-spam, channel lock and vote cooldown)
-   Message snipe - snipe a deleted/modified message (with files support\* and custom history lookup)
-   Minecraft status - a simple minecraft server tracker (Hẻo đã hẻo)
-   To be added:
    -   basic moderation features? most likely no
    -   full size minecraft server tracker?
    -   credit syste- wait wut
    -   image options??? wtf does that even mean
    -   clowns - we need happiness
    -   _ded cuz of depression_

## Requirements

-   NodeJS `16.x`
-   Knowledge about Typescript/Javascript
-   Time to rethink about the purpose of this thing that i made

## Installation and Usage

```
npm i           // install dependencies
npm run build   // compile the project
npm start       // start the bot
```

## Configuration

Change `config.json.example` to `config.json`

Then edit it to suit your needs

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

### `mods/SomeSuckLessFunction.ts`

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
