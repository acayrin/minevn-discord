import Eris from 'eris';

declare module 'eris' {
	interface User {
		/**
		 * Get the user's tag
		 * @returns Tag string
		 */
		tag: () => string;
	}
}

// user
Eris.User.prototype.tag = function (this: Eris.User) {
	return `${this.username}#${this.discriminator}`;
};
