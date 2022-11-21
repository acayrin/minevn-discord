import Eris from 'eris';

declare module 'eris' {
	export interface Guild {
		/**
		 * Get a member from this guild
		 * @param query NAme or ID of the member
		 * @returns Guild member else undefined if not found
		 */
		getUser: (query: string) => Eris.Member | undefined;
	}
}

Eris.Guild.prototype.getUser = function (this: Eris.Guild, query: string): Eris.Member | undefined {
	return !Number.isNaN(query.replace(/[@<>]+/g, ''))
		? this.members.find((member) => member.id.includes(query.replace(/[@<>]+/g, '')))
		: this.members
				.filter((member) =>
					member.nick
						? member.nick.includes(query.toLowerCase())
						: member.username.includes(query.toLowerCase()),
				)
				.shift();
};
