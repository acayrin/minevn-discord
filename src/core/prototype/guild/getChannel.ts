import Eris from 'eris';

declare module 'eris' {
	export interface Guild {
		/**
		 * Get a channel based on name or ID
		 * @param query Name or ID of the channel
		 * @returns Matching guild channel, else undefined if not found
		 */
		getChannel: (query: string) => Eris.AnyGuildChannel | undefined;
	}
}

Eris.Guild.prototype.getChannel = function (this: Eris.Guild, query: string) {
	let result;

	for (const [_, channel] of this.channels)
		if (channel.id === query || channel.name.includes(query)) result = channel;

	return result;
};
