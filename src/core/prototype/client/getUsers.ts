import Eris from 'eris';

declare module 'eris' {
	export interface Client {
		/**
		 * @description Get a users from guilds
		 * @author acayrin
		 * @returns {Eris.Member[]}
		 * @memberof Client
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
