import Eris from 'eris';

declare module 'eris' {
	export interface Guild {
		/**
		 * @description Get a role of this guild
		 * @author acayrin
		 * @param {(string | number)} query search query
		 * @returns {(Eris.Role | undefined)} result role
		 * @memberof Guild
		 */
		getRole: (query: string | number) => Eris.Role | undefined;
	}
}

Eris.Guild.prototype.getRole = function (this: Eris.Guild, query: string | number): Eris.Role | undefined {
	try {
		const gr = this.roles;

		return !Number.isNaN(Number(query))
			? gr.find((r: Eris.Role) => r.id.includes(`${query}`)) // if role is an id
			: gr.find((r: Eris.Role) => r.name.includes(query.toString())); // if role is a name
	} catch (e) {
		return undefined;
	}
};
