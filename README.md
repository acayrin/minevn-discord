# A Somewhat-Suckless-Discord-Bot

as the title, mainly used in MineVN's Discord server

## Usage

```
npm i           // install dependencies
npm run build   // compile the project
npm start       // start the bot
```

<hr>

## Configuration

Change `config.json.example` to `config.json`

Then edit it to suit your needs

Currently custom configs are not supported

<hr>

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

### `SucklessMod.ts`

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

### `SomeSuckLessFunction.ts`

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
