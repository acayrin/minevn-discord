import { DiscordAPIError } from "discord.js"
import { getRole } from "./func"
import { Vote } from "./vote"

export class VoteMute extends Vote {
    async vote(): Promise<void> {
        this.run({
            embed: this.embed.setTitle(`Mute: ${this.target.user.tag} for ${this.bot.config.mute.duration}m`)
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
        if (this.target.roles.cache.has(role.first().id)) {
            this.channel.send(`User **${this.target.user.tag}** is already muted, give them some break will ya`)
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
                .setTitle(`Muted: ${this.target.user.tag} [${this.bot.config.mute.duration}m]`)
                .setDescription(`reason: mob vote\namount ${this.vote_Y} 👍 : ${this.vote_N} 👎`)
        ] })
        try {
            this.target.roles.add(role)
        } catch(e) {
            (await this.channel.guild.members.fetch(this.target.id)).roles.add(role)
        }

        setTimeout(async () => {
            try {
                this.target.roles.remove(role)
            } catch(e) {
                (await this.channel.guild.members.fetch(this.target.id)).roles.remove(role)
            }
            //this.channel.send(`Un-muted **${this.target.user.tag}**`)

            // debug
            if (this.bot.debug)
                this.bot.logger.debug(`[Vote - ${this.id}] Un-muted user ${this.target.id}`)
        }, this.bot.config.mute.duration * 60000)
    }

    /**
     * Triggers when the vote ended as lose (No > Yes)
     *
     * @memberof Vote
     */
    async onLose(): Promise<any> {
        this.msg.edit({ embeds: [
            this.embed
                .setTitle(`Vote ended, nobody was abused`)
                .setDescription(`amount ${this.vote_Y} 👍 : ${this.vote_N} 👎`)
        ] })
    }
}