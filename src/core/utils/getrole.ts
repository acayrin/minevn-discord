import * as Discord from "discord.js";

/**
 * Get a guild's role (if any)
 *
 * @param {string} query search query
 * @param {Guild} guild guild to search in
 * @return {Promise<Collection<string, Role>>} role
 */
export const getRole = async (query: string, guild: Discord.Guild): Promise<Discord.Role> => {
	try {
		const gr = await guild.roles.fetch();
		// if role is an id
		return !isNaN(Number(query))
			? gr.filter((r: Discord.Role) => r.id.includes(query)).first()
			: gr // if role is a name
					.filter((r: Discord.Role) => r.name.toLowerCase().includes(query))
					.first();
	} catch (e) {
		return undefined;
	}
};
