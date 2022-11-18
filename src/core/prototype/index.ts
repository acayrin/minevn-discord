/**
 *
 * Import custom prototypes
 * - bindings from Discord.JS
 * - for an easier life with Eris
 *
 */
import fs from "fs";

// import prototypes recusively
(function inject(path: string): void {
	fs.readdirSync(path).forEach((file) => {
		if (fs.statSync(`${path}/${file}`).isDirectory()) {
			inject(`${path}/${file}`);
		} else if (file.endsWith(".js")) {
			require(`${path}/${file}`);
		}
	});
})(__dirname);
