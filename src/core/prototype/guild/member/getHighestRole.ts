import Eris from "eris";

declare module "eris" {
	export interface Member {
		/**
		 * @description Get highest role
		 * @author acayrin
		 * @returns {(Eris.Role | undefined)} result role
		 * @memberof Member
		 */
		getHighestRole: () => Eris.Role | undefined;
	}
}

Eris.Member.prototype.getHighestRole = function (this: Eris.Member): Eris.Role | undefined {
	let arole = this.guild.roles.get(this.roles[0]);

	this.roles.forEach((role) => {
		const brole = this.guild.roles.get(role);

		if (brole && arole && brole.position > arole.position) {
			arole = brole;
		}
	});

	return arole;
};
