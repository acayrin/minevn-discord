import { getRole } from "./func"
import { Vote } from "./vote"

export class VoteUnmute extends Vote {
    async vote(): Promise<void> {
        this.run({
            embed: this.embed.setTitle(`Un-mute: ${this.target.user.tag}`)
        })
    }

    /**
     * Check if target is already muted
     *
     * @return {*}  {Promise<boolean>}
     * @memberof VoteMute
     */
    async preload(): Promise<boolean> {
        const role = await getRole(this.bot.config.mute.role || "mute", this.channel.guild)
        if (!role.first()) {
            this.channel.send(`Can't find any **muted** role, stop abusing now`)
            return true
        }
        if (!this.target.roles.cache.has(role.first().id)) {
            this.channel.send(`User **${this.target.user.tag}** is not ~~abused~~ muted so ignoring`)
            return true
        }
    }

    /**
     * Triggers when the vote ended as win (Yes > No)
     *
     * @memberof Vote
     */
    async onWin(): Promise<any> {
        const role = await getRole(this.bot.config.mute.role || "mute", this.channel.guild)

        this.msg.edit({ embeds: [
            this.embed
                .setTitle(`Un-muted: ${this.target.user.tag}`)
                .setDescription(`reason: mob vote\namount ${this.vote_Y} 👍 : ${this.vote_N} 👎`)
        ] })
        this.target.roles.remove(role)
    }
}