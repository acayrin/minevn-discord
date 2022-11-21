import * as Eris from 'eris';

declare module 'eris' {
	export interface Role {
		/**
		 * Compare this role to another by their positions
		 * @param role Role to compare with
		 * @returns Difference
		 */
		compareTo: (role: Eris.Role) => number;
	}
}

Eris.Role.prototype.compareTo = function (this: Eris.Role, role: Eris.Role): number {
	return this.position - role.position;
};
