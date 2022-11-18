import Eris from "eris";

declare module "eris" {
	export interface Message {
		/**
		 * @description Reply this message
		 * @author acayrin
		 * @param {Eris.MessageContent} content messag econtent
		 * @param {(Eris.FileContent | Eris.FileContent[])} [file] attachments
		 * @returns {Promise<Eris.Message>} message reply
		 * @memberof Message
		 */
		reply: (content: Eris.MessageContent, file?: Eris.FileContent | Eris.FileContent[]) => Promise<Eris.Message>;
	}
}

Eris.Message.prototype.reply = function (
	this: Eris.Message,
	content: string | Eris.AdvancedMessageContent,
	file?: Eris.FileContent | Eris.FileContent[],
): Promise<Eris.Message> {
	if (typeof content === "string") {
		return this.channel.createMessage(
			{
				content: content.toString(),
				messageReference: {
					messageID: this.id,
				},
			},
			file || [],
		);
	} else {
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
