import Eris from 'eris';

declare module 'eris' {
	export interface Client {
		/**
		 * Get all emojis of this client
		 * @returns List of emojis this client has
		 */
		getEmojis: () => Eris.GuildEmoji[];
		/**
		 * Get an emoji from this client
		 * @param query Name or ID of the emoji
		 * @returns
		 */
		getEmoji: (query: string) => Eris.GuildEmoji[];
	}
}

Eris.Client.prototype.getEmojis = function (this: Eris.Client) {
	const list: Eris.GuildEmoji[] = [];

	this.guilds.map((guild) => guild.emojis.forEach((emoji) => list.push(new Eris.GuildEmoji(emoji))));

	return list;
};

Eris.Client.prototype.getEmoji = function (this: Eris.Client, query: string) {
	const list: Eris.GuildEmoji[] = [];

	this.getEmojis().forEach((emoji) => {
		if (emoji.id === query || emoji.name === query) list.push(new Eris.GuildEmoji(emoji));
	});

	return list;
};
