import Eris from "eris";

declare module "eris" {
	interface Member {
		/**
		 * @descriptio Get member's tag
		 * @author acayrin
		 * @returns {string}
		 * @memberof Member
		 */
		tag: () => string;
	}
}

// guild member
Eris.Member.prototype.tag = function (this: Eris.Member) {
	return `${this.user.username}#${this.user.discriminator}`;
};
