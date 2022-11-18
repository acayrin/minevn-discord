# yujin

a (definitely not skidded) discord bot abomination written in Typescript using Eris and other libraries

## what the fudge does this do?

think of it like running a minecraft server

## how do i use it?

requirements

-   Node: **16+**
-   Bun: lastest version (or NPM/Yarn)
-   OS: Linux is preferable

for now just put a mod source in the **src/mods** folder then compile the project

**oh and please check the source for maliscious code that may harm/steal your things**

```
yarn          // or npm
yarn build    // or bun, npm
yarn start 	  // or bun, npm
```

env vars

```
YUJIN_TOKEN 		- bot token
YUJIN_PREFIX 		- bot prefix
YUJIN_COLOR 		- bot embed color
YUJIN_DISABLED_MODS - list of disabled mods by name
```

for mods config/data, they are stored in the **mods_data/** folder in root directory

## what's inlucded?

some mods i made during the bugs and errors creation of this thing

tho some are not publically available due to _reasons_

## docs?

A quick example
```typescript
import { exec } from 'child_process';
import { resolve } from 'path';
import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		const description = "A test mod";

		super({
			name: 'Test',
			group: 'Test',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description,
			commands: [
				{
					name: 'test',
					description,
					type: 'message',
					process: async (m) => {
						m.reply('This is a test');
					},
				},
				{
					name: 'test',
					description,
					type: 'slash',
					process: async (i) => {
						i.reply('This is a test');
					},
				},
			],
		});
	}
}
```
