import Eris from 'eris';

declare module 'eris' {
  export interface Guild {
    /**
		 * @description Get an emoji in this guild based on given query
		 * @author acayrin
		 * @param {string} query
		 * @returns {(Eris.GuildEmoji | undefined)}
		 * @memberof Guild
		 */
    getEmoji(query: string): Eris.GuildEmoji | undefined;
  }
}

Eris.Guild.prototype.getEmoji = function (this: Eris.Guild, query: string) {
  this.emojis.forEach((e) => {
    if (e.id === query || e.name === query) return new Eris.GuildEmoji(e);
  });

  return undefined;
};
