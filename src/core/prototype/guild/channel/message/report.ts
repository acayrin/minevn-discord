import Eris from 'eris';

declare module 'eris' {
	export interface Message {
		/**
		 * Report runtime error directly in chat
		 * @param error Error instance
		 * @param file File occurred
		 * @returns Created message
		 */
		report: (error: Error, file: string) => Promise<Eris.Message>;
	}
}

Eris.Message.prototype.report = function (this: Eris.Message, error: Error, file: string) {
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
			.addField('**Message**', `\`\`\`${error.name}: ${error.message}\`\`\``)
			.addField('**File occured**', `\`\`\`${line}\`\`\``)
			.addField('**Stacktrace**', `\`\`\`${lines.join('\n')}\`\`\``),
	});
};
