import Eris from 'eris';

import * as Permission from '../../../../utils/permission/Permission';

declare module 'eris' {
	export interface GuildChannel {
		/**
		 * @description Edit a role permission overwrite
		 * @author acayrin
		 * @param {Eris.Role | Eris.Member | string} get a role, member or id to edit
		 * @param {PermissionOption | PermissionOption[]} perms array of perms to set
		 * @returns {(Promise<Eris.PermissionOverwrite> )} result permission overwirte
		 * @memberof GuildChannel
		 */
		editPermissions: (
			get: Eris.Role | Eris.Member | string,
			perms: PermissionOption | PermissionOption[],
		) => Promise<Eris.PermissionOverwrite>;
	}
}

// get relative value for a permission
const pget = (name: string) => Object.entries(Permission.default).find((value) => value[0].includes(name));
const pval = (name: string) => pget(name)?.[1] || BigInt(0);
interface PermissionOption {
	name: Permission.types;
	set: Permission.discord;
}

Eris.GuildChannel.prototype.editPermissions = async function (
	this: Eris.GuildChannel,
	get: Eris.Role | Eris.Member | string,
	perms: PermissionOption | PermissionOption[],
): Promise<Eris.PermissionOverwrite> {
	if (!Array.isArray(perms)) perms = [perms]; // reassign as an array
	const id = get instanceof Eris.Role ? get.id : get instanceof Eris.Member ? get.id : get;
	const type =
		get instanceof Eris.Role || (!(get instanceof Eris.Member) && this.guild.getRole(get) !== undefined) // if role, update as 0
			? 0
			: get instanceof Eris.Member || this.guild.members.find((member) => member.id.includes(id)) // if member, update as 1
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

		for (const perm of perms) {
			switch (perm.set) {
				case 'allow': {
					perms_new.allow += pval(perm.name);
					break;
				}
				case 'deny': {
					perms_new.deny += pval(perm.name);
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
				id: id,
				allow: perms_new.allow,
				deny: perms_new.deny,
				type: type,
			}),
		);
	} else {
		const perms_current: {
			allow: bigint;
			deny: bigint;
		} = {
			allow: existing_override.allow,
			deny: existing_override.deny,
		};

		for (const perm of perms) {
			const current_state = Object.entries(existing_override.json).find((perm_state) =>
				perm_state[0].includes(perm.name),
			);
			console.log(`> ${perm.name} :: ${current_state}`);

			switch (perm.set) {
				case 'allow': {
					perms_current.allow += pval(perm.name);
					// remove deny override if exist
					if (current_state !== undefined && current_state[1] === false) {
						perms_current.deny -= pval(perm.name);
					}
					break;
				}
				case 'deny': {
					perms_current.deny += pval(perm.name);
					// remove allow override if exist
					if (current_state !== undefined && current_state[1] === true) {
						perms_current.allow -= pval(perm.name);
					}
					break;
				}
				case 'default': {
					// if current state is false, remove it
					if (current_state !== undefined && !current_state[1]) {
						perms_current.deny -= pval(perm.name);
					}
					// if current state is true, remove it
					if (current_state !== undefined && current_state[1]) {
						perms_current.allow -= pval(perm.name);
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
				id: id,
				allow: perms_current.allow,
				deny: perms_current.deny,
				type: type,
			}),
		);
	}
};
