import Eris from 'eris';

declare module 'eris' {
	export interface Guild {
		/**
		 * Get an emoji in this guild based on given query
		 * @param query Name or ID of the emoji
		 */
		getEmoji(query: string): Eris.GuildEmoji | undefined;
	}
}

Eris.Guild.prototype.getEmoji = function (this: Eris.Guild, query: string) {
	let result: Eris.GuildEmoji;

	this.emojis.forEach((emoji) => {
		if (emoji.id === query || emoji.name === query) result = new Eris.GuildEmoji(emoji);
	});

	return result;
};
