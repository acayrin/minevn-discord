import * as http from "http";
import { SucklessBot } from "../core/sucklessbot";

export = {
	name: "Keep alive",
	description: "A simple bot keep alive",
	command: "",
	author: "",
	intents: [],
	usage: "there is no usage",
	onInit: (bot: SucklessBot) => {
		const requestListener = function (
			req: any,
			res: { writeHead: (arg0: number) => void; end: (arg0: string) => void }
		) {
			res.writeHead(200);
			res.end("PING PONG!");
		};
		const server = http.createServer(requestListener);
		const port = Number(process.env.PORT) || 3333;
		const host = "localhost";
		server.listen(port, host, 0, () => {
			bot.logger.log("[KeepAlive] Started server");
		});
	},
};
