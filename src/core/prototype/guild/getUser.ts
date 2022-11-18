import Eris from "eris";

declare module "eris" {
	export interface Guild {
		/**
		 * @description Get a member from this guild
		 * @author acayrin
		 * @param {string} query search query
		 * @returns {(Eris.Member | undefined)} result member
		 * @memberof Guild
		 */
		getUser: (query: string) => Eris.Member | undefined;
	}
}

Eris.Guild.prototype.getUser = function (this: Eris.Guild, query: string): Eris.Member | undefined {
	try {
		if (!Number.isNaN(Number(query.replace(/[@<>]+/g, ""))))
			return this.members.find((member) => member.id.includes(query.replace(/[@<>]+/g, "")));
		else
			return this.members
				.filter((member) =>
					member.nick
						? member.nick.includes(query.toLowerCase())
						: member.username.includes(query.toLowerCase()),
				)
				.shift();
	} catch (e) {
		return undefined;
	}
};
