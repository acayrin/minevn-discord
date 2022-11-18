import Eris from 'eris';

declare module 'eris' {
	export interface CommandInteraction {
		/**
		 * @description Get the guild from interaction
		 * @author acayrin
		 * @returns {(Eris.Guild)}
		 * @memberof CommandInteraction
		 */
		guild: () => Eris.Guild;
		/**
		 * @description Reply the current interaction
		 * @param content message content
		 * @param file file content
		 * @returns A message
		 */
		reply: (
			content: string | Eris.InteractionContent,
			file?: Eris.FileContent | Eris.FileContent[],
		) => Promise<Eris.Message>;
		/**
		 * @description Report error of this interaction
		 * @param error Error instance
		 * @param file File occured
		 * @returns A message
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
		for (const lne of error.stack.split('\n')) {
			if (`${error.name}: ${error.message}`.split('\n').includes(lne)) {
				continue;
			}
			lines.push(lne);
			if (lne.includes(file)) {
				line = lne;
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
