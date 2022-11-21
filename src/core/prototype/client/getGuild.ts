import Eris from 'eris';

declare module 'eris' {
	export interface Client {
		/**
		 * Get a guild based on search query
		 * @param query Name or ID of the guild
		 * @returns
		 */
		getGuild: (query: string) => Eris.Guild | undefined;
	}
}

Eris.Client.prototype.getGuild = function (this: Eris.Client, query: string) {
	let result: Eris.Guild;

	for (const guild of Array.from(this.guilds))
		if (guild[1].id.includes(query) || guild[1].name.includes(query)) result = guild[1];

	return result;
};
