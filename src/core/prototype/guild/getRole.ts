import Eris from 'eris';

declare module 'eris' {
	export interface Guild {
		/**
		 * Get a role of this guild
		 * @param query Name or ID of the role
		 * @returns Guild role else undefined if not found
		 */
		getRole: (query: string) => Eris.Role | undefined;
	}
}

Eris.Guild.prototype.getRole = function (this: Eris.Guild, query: string): Eris.Role | undefined {
	let result: Eris.Role;

	for (const role of this.roles) if (role[1].id === query || role[1].name.includes(query)) result = role[1];

	return result;
};
