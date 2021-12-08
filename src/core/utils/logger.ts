import * as clc from "colors-cli";

/**
 * A Console Logger
 *
 * @class Logger
 */
export class Logger {
	/**
	 * Print a debug message
	 *
	 * @param {string} msg
	 * @memberof Logger
	 */
	public debug = (msg: string) => {
		console.log(`${clc.x246(`[${new Date().toLocaleString()} - DEBUG] ${msg}`)}`);
	};

	/**
	 * Print an info message
	 *
	 * @param {string} msg
	 * @memberof Logger
	 */
	public log = (msg: string) => {
		console.log(`[${new Date().toLocaleString()} - INFO] ${msg}`);
	};

	/**
	 * Print a warning message
	 *
	 * @param {string} msg
	 * @memberof Logger
	 */
	public warn = (msg: string) => {
		console.log(`${clc.yellow(`[${new Date().toLocaleString()} - WARN] ${msg}`)}`);
	};

	/**
	 * Print an error message
	 *
	 * @param {string} msg
	 * @memberof Logger
	 */
	public error = (msg: string) => {
		console.log(`${clc.red(`[${new Date().toLocaleString()} - ERROR] ${msg}`)}`);
	};
}
