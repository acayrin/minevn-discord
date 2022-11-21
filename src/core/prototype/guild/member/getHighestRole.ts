import Eris from 'eris';

declare module 'eris' {
	export interface Member {
		/**
		 * Get the highest role of a member
		 * @returns Highest role else undefined if member has none
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
