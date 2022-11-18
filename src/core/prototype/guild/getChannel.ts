import Eris from "eris";

declare module "eris" {
	export interface Guild {
		/**
		 * @description Get a channel based on search query
		 * @author acayrin
		 * @param {string} query
		 * @returns {*}  {(Eris.AnyGuildChannel | undefined)}
		 * @memberof Guild
		 */
		getChannel: (query: string) => Eris.AnyGuildChannel | undefined;
	}
}

Eris.Guild.prototype.getChannel = function (this: Eris.Guild, query: string) {
	// id search
	this.channels.forEach((channel) => {
		if (channel.id === query) {
			return channel;
		}
	});

	// name search
	this.channels.forEach((channel) => {
		if (channel.name.includes(query)) {
			return channel;
		}
	});

	return undefined;
};
