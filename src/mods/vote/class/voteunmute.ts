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
        this._run({
            embed: this._embed().setTitle(`Un-mute: ${this.target.user.tag}`),
        });
    }

    /**
     * Triggers when the vote ended as win (Yes > No)
     *
     * @memberof VoteUnmute
     */
    async onWin(): Promise<any> {
        const role = await getRole(
            this._bot.config.mute.role || "mute",
            this.channel.guild
        );

        this.msg.edit({
            embeds: [
                this._embed()
                    .setTitle(`Un-muted: ${this.target.user.tag}`)
                    .setDescription(
                        `reason: ${this.reason}\namount ${this._vote_Y} 👍 : ${this._vote_N} 👎`
                    ),
            ],
        });
        this.target.roles.remove(role).catch((e) => {
            this.channel.send(
                `I failed to set **${this.target.user.tag}** free (err: ${e})`
            );
        });
    }
}
