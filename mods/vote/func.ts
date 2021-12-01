import { Collection, Guild, Role } from "discord.js"

/**
 * Get a guild's role (if any)
 *
 * @param {string} query search query
 * @param {Guild} guild guild to search in
 * @return {Promise<Collection<string, Role>>} role
 */
export const getRole = async (query: string, guild: Guild): Promise<Collection<string, Role>> => {
    const gr = await guild.roles.fetch()
    // if role is an id
    if (!isNaN(Number(query)))
        return gr.filter((r: Role) => r.id.includes(query))
    // if role is a name
    else
        return gr.filter((r: Role) => r.name.toLowerCase().includes(query))
}