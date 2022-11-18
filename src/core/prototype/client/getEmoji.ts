import Eris from 'eris';

declare module 'eris' {
  export interface Client {
    /**
     * @description Get all emojis of this client
     * @author acayrin
     * @returns {Eris.GuildEmoji[]}
     * @memberof Client
     */
    getEmojis: () => Eris.GuildEmoji[];
    /**
     * @description Get an emoji from client
     * @author acayrin
     * @param {string} query
     * @returns {Eris.GuildEmoji[]}
     * @memberof Guild
     */
    getEmoji: (query: string) => Eris.GuildEmoji[];
  }
}

Eris.Client.prototype.getEmojis = function (this: Eris.Client) {
  let list: Eris.GuildEmoji[] = [];

  this.guilds.forEach((guild) => guild.emojis.forEach((emoji) => list.push(new Eris.GuildEmoji(emoji))));

  return list;
};

Eris.Client.prototype.getEmoji = function (this: Eris.Client, query: string) {
  const list: Eris.GuildEmoji[] = [];

  this.getEmojis().forEach((emoji) => {
    if (emoji.id === query || emoji.name === query) list.push(new Eris.GuildEmoji(emoji));
  });

  return list;
};
