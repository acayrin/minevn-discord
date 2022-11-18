import Eris from "eris";

import * as Permission from "../../../../utils/permission/Permission";

declare module "eris" {
	export interface GuildChannel {
		/**
		 * @description Check if the channel has a role permission overwrite
		 * @author acayrin
		 * @param {Eris.Role} role role to look in
		 * @param {Permission.types} perms permission to check for
		 * @returns {boolean}
		 * @memberof GuildChannel
		 */
		hasPermission: (role: Eris.Role, perms: Permission.types) => boolean;
	}
}

Eris.GuildChannel.prototype.hasPermission = function (
	this: Eris.GuildChannel,
	role: Eris.Role,
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
