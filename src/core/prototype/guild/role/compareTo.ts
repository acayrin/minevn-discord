import * as Eris from "eris";

declare module "eris" {
	export interface Role {
		/**
		 * @description Compare this role to another by their positions
		 * @author acayrin
		 * @param {Eris.Role} role
		 * @returns {*}  {number}
		 * @memberof Role
		 */
		compareTo: (role: Eris.Role) => number;
	}
}

Eris.Role.prototype.compareTo = function (this: Eris.Role, role: Eris.Role): number {
	return this.position - role.position;
};
