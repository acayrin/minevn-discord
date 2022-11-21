import Eris from 'eris';

declare module 'eris' {
	export interface Member {
		/**
		 * Get a role of this member, if any
		 * @param query ID or name of the role
		 */
		getRole(query: string): Eris.Role | undefined;
	}
}

Eris.Member.prototype.getRole = function (this: Eris.Member, query: string) {
	let result: Eris.Role;

	for (const r of this.roles) {
		const role = this.guild.getRole(r);

		if (role && (role.id.toString().includes(query) || role.name.includes(query))) {
			result = role;
		}
	}

	return result;
};
