import Eris from 'eris';

declare module 'eris' {
	export interface Message {
		/**
		 * Get the guild of this message
		 */
		guild(): Eris.Guild;
	}
}

Eris.Message.prototype.guild = function (this: Eris.Message) {
	return this.channel.client.getGuild(this.guildID);
};
