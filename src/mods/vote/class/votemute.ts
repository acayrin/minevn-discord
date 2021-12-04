import { getRole } from "../../../core/utils";
import * as recentmutes from "../recentmute";
import { Vote } from "./vote";

/**
 * Vote mute instance, extends from Vote
 *
 * @export
 * @class VoteMute
 * @extends {Vote}
 */
export class VoteMute extends Vote {
    /**
     * Override base vote run phase
     *
     * @return {*}  {Promise<void>}
     * @memberof VoteMute
     */
    async vote(): Promise<void> {
        this._run({
            embed: this._embed().setTitle(
                `Mute: ${this.target.user.tag} for ${this._bot.config.mute.duration}m`
            ),
        });
    }

    /**
     * Triggers when the vote ended as win (Yes > No)
     *
     * @memberof Vote
     */
    async onWin(): Promise<any> {
        const role = await getRole(
            this._bot.config.mute.role || "mute",
            this.channel.guild
        );

        this.msg.edit({
            embeds: [
                this._embed()
                    .setTitle(
                        `Muted: ${this.target.user.tag} [${this._bot.config.mute.duration}m]`
                    )
                    .setDescription(
                        `reason: ${this.reason}\namount ${this._vote_Y} 👍 : ${this._vote_N} 👎`
                    ),
            ],
        });
        this.target.roles
            .add(role)
            .catch((e) => {
                // user left server before the vote ends
                return this.channel.send(
                    `User **${this.target.user.tag}** can't be abused cuz they ran away like a wimp`
                );
            })
            .then(() => {
                // only when the user is still in the server
                // remove role after timeout
                setTimeout(async () => {
                    this.target.roles.remove(role).catch((e) => {
                        this.channel.send(
                            `User **${this.target.user.tag}** can't be abused cuz they ran away like a wimp`
                        );
                    });
                    //this.channel.send(`Unmuted **${this.target.user.tag}**`)

                    // recent mute
                    // remove after 2x[mute duration]
                    recentmutes.add(this.target.id);
                    setTimeout(() => {
                        recentmutes.remove(this.target.id);
                    }, this._bot.config.mute.duration * 2 * 60000);

                    // debug
                    if (this._bot.debug)
                        this._bot.logger.debug(
                            `[Vote - ${this.id}] Unmuted user ${this.target.id}`
                        );
                }, this._bot.config.mute.duration * 60000);
            });
    }

    /**
     * Triggers when the vote ended as lose (No > Yes)
     *
     * @memberof Vote
     */
    async onLose(): Promise<any> {
        this.msg.edit({
            embeds: [
                this._embed()
                    .setTitle(`Vote ended, nobody was abused`)
                    .setDescription(
                        `amount ${this._vote_Y} 👍 : ${this._vote_N} 👎`
                    ),
            ],
        });
    }
}
