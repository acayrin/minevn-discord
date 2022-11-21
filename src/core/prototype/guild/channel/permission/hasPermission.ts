import Eris from 'eris';

import * as Permission from '../../../../utils/permission/Permission';

declare module 'eris' {
	export interface GuildChannel {
		/**
		 * Check if the channel has a role or member permission overwrite
		 * @param role Role to check for
		 * @param perms Permissions to check for
		 * @returns
		 */
		hasPermission: (role: Eris.Role | Eris.Member, perms: Permission.types) => boolean;
	}
}

Eris.GuildChannel.prototype.hasPermission = function (
	this: Eris.GuildChannel,
	role: Eris.Role | Eris.Member,
	perm: Permission.types,
): boolean {
	// perm = bigint_1
	// if override:
	//   loop overrides > get bigint_2
	//     if bigint_1 = bigint_2 > true
	// > false

	// channel perms
	const override = this.permissionOverwrites.find((o) => o.id === role.id);
	// guild base perms
	const rperm = role.permissions;
	const status = Object.entries(rperm.json).find((o) => o[0] === perm);

	if (!override && status) {
		return status[1];
	} else if (override) {
		for (const [k, v] of Object.entries(override.json)) if (k === perm) return v;
	}
	return true;
};
