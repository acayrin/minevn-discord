import Eris from 'eris';

declare module 'eris' {
  export interface Message {
    /**
		 * @description Get the guild
		 * @author acayrin
		 * @returns {(Eris.Guild | undefined)}
		 * @memberof Message
		 */
    guild(): Eris.Guild | undefined;
  }
}

Eris.Message.prototype.guild = function (this: Eris.Message) {
  return this.member?.guild;
};
