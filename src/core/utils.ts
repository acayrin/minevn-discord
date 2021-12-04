import { Collection, Guild, GuildMember, Role } from "discord.js";

/**
 * Get a guild's role (if any)
 *
 * @param {string} query search query
 * @param {Guild} guild guild to search in
 * @return {Promise<Collection<string, Role>>} role
 */
export const getRole = async (query: string, guild: Guild): Promise<Role> => {
    try {
        const gr = await guild.roles.fetch();
        // if role is an id
        if (!isNaN(Number(query)))
            return gr.filter((r: Role) => r.id.includes(query)).first();
        // if role is a name
        else
            return gr
                .filter((r: Role) => r.name.toLowerCase().includes(query))
                .first();
    } catch (e) {
        return undefined;
    }
};

/**
 * Get a user from a guild based on given ID
 *
 * @param {string} query User ID/Search query
 * @param {Guild} guild Guild to search in
 * @returns {Promise<GuildMember} member
 */
export const getUser = async (
    query: string,
    guild: Guild
): Promise<GuildMember> => {
    try {
        if (!isNaN(Number(query)))
            return await guild.members.fetch({ user: query });
        else
            return (
                await guild.members.fetch({ query: query, limit: 1 })
            ).first();
    } catch (e) {
        return undefined;
    }
};
