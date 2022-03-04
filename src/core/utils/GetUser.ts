import * as Discord from "discord.js";

/**
 * Get a user from a guild based on given ID
 *
 * @param {string} query User ID/Search query
 * @param {Guild} guild Guild to search in
 * @returns {Promise<GuildMember} member
 */
export const getUser = async (query: string, guild: Discord.Guild): Promise<Discord.GuildMember> => {
	try {
		if (!isNaN(Number(query))) return await guild.members.fetch({ user: query });
		else return (await guild.members.fetch({ query: query, limit: 1 })).first();
	} catch (e) {
		return undefined;
	}
};
