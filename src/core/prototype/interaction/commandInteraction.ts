import Eris from 'eris';

declare module 'eris' {
	export interface CommandInteraction {
		/**
		 * Get the guild from interaction
		 * @returns Guild
		 */
		guild: () => Eris.Guild;
		/**
		 * Create a referencing message for this interaction
		 * @param content Message content
		 * @param file File attachments
		 * @returns Created message
		 */
		reply: (
			content: string | Eris.InteractionContent,
			file?: Eris.FileContent | Eris.FileContent[],
		) => Promise<Eris.Message>;
		/**
		 * Report runtime error directly to channel
		 * @param error Error instance
		 * @param file File occured
		 * @returns Created message
		 */
		report: (error: Error, file: string) => Promise<Eris.Message>;
	}
}

Eris.CommandInteraction.prototype.guild = function (this: Eris.CommandInteraction) {
	return this.channel.client.getGuild(this.guildID);
};

Eris.CommandInteraction.prototype.reply = function (
	this: Eris.CommandInteraction,
	content: string | Eris.InteractionContent,
	file?: Eris.FileContent | Eris.FileContent[],
) {
	return this.createFollowup(content, file);
};

Eris.CommandInteraction.prototype.report = function (this: Eris.Message, error: Error, file: string) {
	const lines = [];
	let line = 'external';

	if (error.stack)
		for (const stackLine of error.stack.split('\n')) {
			if (`${error.name}: ${error.message}`.split('\n').includes(stackLine)) {
				continue;
			}
			lines.push(stackLine);
			if (stackLine.includes(file)) {
				line = stackLine;
				break;
			}
			if (lines.length > 6) {
				break;
			}
		}

	return this.channel.createMessage({
		embed: new Eris.Embed()
			.setTitle('An error has occured. Please try again or contact the author.')
			.setColor('#ff0000')
			.addField('**Message**', '```' + `${error.name}: ${error.message}` + '```')
			.addField('**File occured**', `\`\`\`${line}\`\`\``)
			.addField('**Stacktrace**', `\`\`\`${lines.join('\n')}\`\`\``),
	});
};
