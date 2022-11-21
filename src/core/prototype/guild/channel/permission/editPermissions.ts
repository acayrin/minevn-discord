import Eris from 'eris';

import * as Permission from '../../../../utils/permission/Permission';

declare module 'eris' {
	export interface GuildChannel {
		/**
		 * Edit a role or member permission overwrite of a channel
		 * @param target Role to edit
		 * @param permissionOverwrite Permissions to edit
		 * @returns New permission overwrite
		 */
		editPermissions: (
			target: Eris.Role | Eris.Member | string,
			permissionOverwrite: PermissionOption | PermissionOption[],
		) => Promise<Eris.PermissionOverwrite>;
	}
}

// get relative value for a permission
const permissionGet = (name: string) => Object.entries(Permission.default).find((value) => value[0].includes(name));
const permissionVal = (name: string) => permissionGet(name)?.[1] || BigInt(0);
interface PermissionOption {
	name: Permission.types;
	set: Permission.discord;
}

Eris.GuildChannel.prototype.editPermissions = async function (
	this: Eris.GuildChannel,
	target: Eris.Role | Eris.Member | string,
	permissionOverwrite: PermissionOption | PermissionOption[],
): Promise<Eris.PermissionOverwrite> {
	if (!Array.isArray(permissionOverwrite)) permissionOverwrite = [permissionOverwrite]; // reassign as an array
	const id = target instanceof Eris.Role ? target.id : target instanceof Eris.Member ? target.id : target;
	const type =
		target instanceof Eris.Role || (!(target instanceof Eris.Member) && this.guild.getRole(target) !== undefined) // if role, update as 0
			? 0
			: target instanceof Eris.Member || this.guild.members.find((member) => member.id.includes(id)) // if member, update as 1
			? 1
			: undefined;
	if (type === undefined) throw new Error(`${id} doesn't appear to be a valid Snowflake for this guild`);

	// get permission override for role
	const existing_override = this.permissionOverwrites.find((perm) => perm.id.includes(id));

	if (existing_override === undefined) {
		// new perms override
		const perms_new: {
			allow: bigint;
			deny: bigint;
		} = {
			allow: BigInt(0),
			deny: BigInt(0),
		};

		for (const perm of permissionOverwrite) {
			switch (perm.set) {
				case 'allow': {
					perms_new.allow += permissionVal(perm.name);
					break;
				}
				case 'deny': {
					perms_new.deny += permissionVal(perm.name);
					break;
				}
				case 'default': {
					// nothing, don't set it
					break;
				}
				default: {
					// nothing, don't set it
				}
			}
		}

		// set new override
		await this.editPermission(id, perms_new.allow, perms_new.deny, type);
		return this.permissionOverwrites.add(
			new Eris.PermissionOverwrite({
				id,
				allow: perms_new.allow,
				deny: perms_new.deny,
				type,
			}),
		);
	}
	const perms_current: {
		allow: bigint;
		deny: bigint;
	} = {
		allow: existing_override.allow,
		deny: existing_override.deny,
	};

	for (const perm of permissionOverwrite) {
		const current_state = Object.entries(existing_override.json).find((perm_state) =>
			perm_state[0].includes(perm.name),
		);

		switch (perm.set) {
			case 'allow': {
				perms_current.allow += permissionVal(perm.name);
				// remove deny override if exist
				if (current_state !== undefined && current_state[1] === false) {
					perms_current.deny -= permissionVal(perm.name);
				}
				break;
			}
			case 'deny': {
				perms_current.deny += permissionVal(perm.name);
				// remove allow override if exist
				if (current_state !== undefined && current_state[1] === true) {
					perms_current.allow -= permissionVal(perm.name);
				}
				break;
			}
			case 'default': {
				// if current state is false, remove it
				if (current_state !== undefined && !current_state[1]) {
					perms_current.deny -= permissionVal(perm.name);
				}
				// if current state is true, remove it
				if (current_state !== undefined && current_state[1]) {
					perms_current.allow -= permissionVal(perm.name);
				}
				break;
			}
			default: {
				// don't touch it
			}
		}
	}

	// set new override
	await this.editPermission(id, perms_current.allow, perms_current.deny, type);
	return this.permissionOverwrites.add(
		new Eris.PermissionOverwrite({
			id,
			allow: perms_current.allow,
			deny: perms_current.deny,
			type,
		}),
	);
};
