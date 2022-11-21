import Eris from 'eris';

declare module 'eris' {
	interface Member {
		/**
		 * Get a member's user tag
		 * @returns Tag string
		 */
		tag: () => string;
	}
}

// guild member
Eris.Member.prototype.tag = function (this: Eris.Member) {
	return `${this.user.username}#${this.user.discriminator}`;
};
