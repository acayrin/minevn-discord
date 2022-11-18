import Eris from 'eris';

export type Item = {
	// id of the item (unique)
	id: string;
	// name of the item
	name: string;
	// description of the item
	description: string;
	// emote of the item
	icon: string | Eris.GuildEmoji;
	// extra data of the item
	data?: unknown;
};
