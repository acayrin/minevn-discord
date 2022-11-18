import Eris from "eris";

declare module "eris" {
	export interface Message {
		/**
		 * @description Report a runtime error to chat
		 * @author acayrin
		 * @param {Error} error Error object
		 * @param {string} file set it to ``__filename``
		 * @returns {Promise<Eris.Message>} created message
		 * @memberof Message
		 */
		report: (error: Error, file: string) => Promise<Eris.Message>;
	}
}

Eris.Message.prototype.report = function (this: Eris.Message, error: Error, file: string) {
	const lines = [];
	let line = "external";
	if (error.stack)
		for (const lne of error.stack.split("\n")) {
			if (`${error.name}: ${error.message}`.split("\n").includes(lne)) {
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
			.setTitle("An error has occured. Please try again or contact the author.")
			.setColor("#ff0000")
			.addField("**Message**", "```" + `${error.name}: ${error.message}` + "```")
			.addField("**File occured**", `\`\`\`${line}\`\`\``)
			.addField("**Stacktrace**", `\`\`\`${lines.join("\n")}\`\`\``),
	});
};
