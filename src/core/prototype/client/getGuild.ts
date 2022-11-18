import Eris from 'eris';

declare module 'eris' {
	export interface Client {
		/**
		 * @description Get a guild based on search query
		 * @author acayrin
		 * @param {string} query
		 * @returns {(Eris.Guild | undefined)}
		 * @memberof Client
		 */
		getGuild: (query: string) => Eris.Guild | undefined;
	}
}

Eris.Client.prototype.getGuild = function (this: Eris.Client, query: string) {
	// id search
	for (const guild of Array.from(this.guilds)) {
		if (guild[1].id.toString().includes(query)) {
			return guild[1];
		}
	}
	// name search
	for (const guild of Array.from(this.guilds)) {
		if (guild[1].name.includes(query)) {
			return guild[1];
		}
	}

	return undefined;
};
