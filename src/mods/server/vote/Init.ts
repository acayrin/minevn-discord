/* eslint-disable @typescript-eslint/no-explicit-any */

import Yujin from '../../../core/yujin';

export async function Init(mod: Yujin.Mod) {
	if (!mod.getConfig())
		mod.generateConfig({
			timer: 30,
			duration: 10,
			channel: ['859837426414256148', '838016418180104246', '975377817510481950'],
			muted_role: '650374206306910221',
			use_timeout: false,
			ignored_roles: ['977459819717992448'],
			emojis: {
				yes: 'option_yes',
				no: 'option_no',
			},
		});

	const db = mod.getDatastore();
	setInterval(() => {
		// read through all groups
		Array.from(Object.keys(db.list())).forEach((k: string) => {
			// ignore global
			if (k === '__GLOBAL__') return;

			// get related variables
			const guild = mod.bot.client.getGuild(k);
			const role = guild?.getRole(mod.getConfig().muted_role || 'mute');
			if (!guild || !role)
				return mod.bot.error({
					name: mod.name,
					message: `Error processing guild ${k} - G:${!!guild?.id} R:${!!role?.id}`,
				});

			// read through muted list
			Promise.all(
				db.list()[k].map(async (a: any[]) => {
					const user = guild.getUser(a[0]);

					// if user not found
					if (!user) mod.bot.error({ name: mod.name, message: `Unable to find user ${a[0]} of guild ${k}` });

					const time: { endMute: number; endProtect: number } = a[1];

					// only remove if user is still in the guild and the user still has the role
					if (user?.getRole(role.id) && Date.now() > time.endMute) {
						user.removeRole(role.id).catch((e) => {
							mod.bot.error({
								name: mod.name,
								message: `Unable to remove muted role from ${user.id} - ${e.message}`,
								cause: e.cause,
								stack: e.stack,
							});
						});
					}

					// remove entry when out of protection time
					if (Date.now() > time.endProtect) {
						await db.remove(a[0], k);
						mod.bot.info(`[${mod.name} - Task] Removed protection from user ${a[0]}`);
					}
				}),
			).catch((e: Error) => {
				mod.bot.error({
					name: mod.name,
					message: `Encountered error while checking datastore - ${e.message}`,
					cause: e.cause,
					stack: e.stack,
				});
			});
		});
	}, 5_000);
}
