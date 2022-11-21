import Eris from 'eris';

declare module 'eris' {
	export interface Message {
		/**
		 * Generate a message referencing this message
		 * @param content Content of the message
		 * @param file File attachments
		 * @returns Created message
		 */
		reply: (content: Eris.MessageContent, file?: Eris.FileContent | Eris.FileContent[]) => Promise<Eris.Message>;
	}
}

Eris.Message.prototype.reply = function (
	this: Eris.Message,
	content: string | Eris.AdvancedMessageContent,
	file?: Eris.FileContent | Eris.FileContent[],
): Promise<Eris.Message> {
	switch (typeof content) {
		case 'string':
			return this.channel.createMessage(
				{
					content: content.toString(),
					messageReference: {
						messageID: this.id,
					},
				},
				file || [],
			);
		default:
			return this.channel.createMessage(
				Object.assign(content, {
					messageReference: {
						messageID: this.id,
					},
				}),
				file || [],
			);
	}
};
