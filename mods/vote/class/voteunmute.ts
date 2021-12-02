import { getRole } from "../../../core/utils";
import { Vote } from "./vote";

export class VoteUnmute extends Vote {
    /**
     * Override base vote run phase
     *
     * @return {*}  {Promise<void>}
     * @memberof VoteMute
     */
    async vote(): Promise<void> {
        this.run({
            embed: this.embed.setTitle(`Un-mute: ${this.target.user.tag}`),
        });
    }

    /**
     * Triggers when the vote ended as win (Yes > No)
     *
     * @memberof VoteUnmute
     */
    async onWin(): Promise<any> {
        const role = await getRole(
            this.bot.config.mute.role || "mute",
            this.channel.guild
        );

        this.msg.edit({
            embeds: [
                this.embed
                    .setTitle(`Un-muted: ${this.target.user.tag}`)
                    .setDescription(
                        `reason: mob vote\namount ${this.vote_Y} 👍 : ${this.vote_N} 👎`
                    ),
            ],
        });
        this.target.roles.remove(role).catch(async (e) => {
            (await this.getTarget()).roles.remove(role);
        });
    }
}
