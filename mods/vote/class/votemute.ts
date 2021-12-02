import { recentMutes } from "..";
import { getRole } from "../../../core/utils";
import { Vote } from "./vote";

export class VoteMute extends Vote {
    /**
     * Override base vote run phase
     *
     * @return {*}  {Promise<void>}
     * @memberof VoteMute
     */
    async vote(): Promise<void> {
        this.run({
            embed: this.embed.setTitle(
                `Mute: ${this.target.user.tag} for ${this.bot.config.mute.duration}m`
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
            this.bot.config.mute.role || "mute",
            this.channel.guild
        );

        this.msg.edit({
            embeds: [
                this.embed
                    .setTitle(
                        `Muted: ${this.target.user.tag} [${this.bot.config.mute.duration}m]`
                    )
                    .setDescription(
                        `reason: ${this.reason}\namount ${this.vote_Y} 👍 : ${this.vote_N} 👎`
                    ),
            ],
        });
        this.target.roles.add(role).catch(async (e) => {
            (await this.getTarget()).roles.add(role);
        });

        setTimeout(async () => {
            this.target.roles.remove(role).catch(async (e) => {
                (await this.getTarget()).roles.remove(role);
            });
            //this.channel.send(`Un-muted **${this.target.user.tag}**`)

            // recent mute
            recentMutes.push(this.target.id);
            setTimeout(() => {
                recentMutes.splice(recentMutes.indexOf(this.target.id), 1);
            }, this.bot.config.mute.duration * 2 * 1000);

            // debug
            if (this.bot.debug)
                this.bot.logger.debug(
                    `[Vote - ${this.id}] Un-muted user ${this.target.id}`
                );
        }, this.bot.config.mute.duration * 60000);
    }

    /**
     * Triggers when the vote ended as lose (No > Yes)
     *
     * @memberof Vote
     */
    async onLose(): Promise<any> {
        this.msg.edit({
            embeds: [
                this.embed
                    .setTitle(`Vote ended, nobody was abused`)
                    .setDescription(
                        `amount ${this.vote_Y} 👍 : ${this.vote_N} 👎`
                    ),
            ],
        });
    }
}
