import Eris from 'eris';

declare module 'eris' {
	export interface Client {
		/**
		 * Get all members from all guilds
		 * @returns List of members from all guilds
		 */
		getUsers: () => Eris.Member[];
	}
}

Eris.Client.prototype.getUsers = function (this: Eris.Client) {
	const users: Eris.Member[] = [];

	for (const guild of Array.from(this.guilds)) {
		guild[1].members.map((mem) => users.push(mem));
	}

	return users;
};
