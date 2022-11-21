import clc from 'colors-cli';
import fs from 'fs';
import path from 'path';

/**
 * A Console Logger
 *
 * @class Logger
 */
export class Logger {
	#headless: boolean = false;
	readonly file: string;
	readonly directory = `${path.resolve('./')}/logs`;

	constructor(o?: { headless: boolean }) {
		if (o?.headless) {
			this.#headless = o.headless;
			return;
		}

		if (!fs.existsSync(this.directory)) {
			fs.mkdirSync(this.directory, { recursive: true });
		}

		const d = new Date();
		const f = `log_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}_${d.getDate()}-${d.getMonth()}-${d.getFullYear()}_${d.getTime()}.txt`;
		this.file = `${this.directory}/latest.log`;

		const files = fs.readdirSync(this.directory, 'utf8').sort((f1, f2) => {
			return (
				Number.parseFloat(f2.split('.').at(0).split('_').at(-1)) -
				Number.parseFloat(f1.split('.').at(0).split('_').at(-1))
			);
		});
		if (files.length > 30) {
			fs.rmSync(
				files
					.sort((f1, f2) => fs.statSync(f2).birthtime.getTime() - fs.statSync(f1).birthtime.getTime())
					.at(-1),
			);
		}

		process.on('SIGINT', () => {
			try {
				fs.renameSync(this.file, `${this.directory}/${f}`);
			} catch (_) {}
			process.exit();
		});
	}

	#log(msg: string) {
		console.log(msg);
		if (!this.#headless) this.#flush(msg);
	}

	/**
	 * Print a debug message
	 *
	 * @param {string} msg
	 * @memberof Logger
	 */
	debug(msg: string) {
		this.#log(`${clc.x246(`[${new Date().toLocaleString()} - DEBUG] ${msg}`)}`);
	}

	/**
	 * Print an info message
	 *
	 * @param {string} msg
	 * @memberof Logger
	 */
	info(msg: string) {
		this.#log(`[${new Date().toLocaleString()} - INFO] ${msg}`);
	}

	/**
	 * Print a warning message
	 *
	 * @param {string} msg
	 * @memberof Logger
	 */
	warn(msg: string) {
		this.#log(`${clc.yellow(`[${new Date().toLocaleString()} - WARN] ${msg}`)}`);
	}

	/**
	 * Print an error message
	 *
	 * @param {Error} err
	 * @memberof Logger
	 */
	error(err: Error) {
		this.#log(
			`${clc.red(
				[
					`[${new Date().toLocaleString()} - ERROR]`,
					`- Name: ${err.name}`,
					`- Message: ${err.message}`,
					`- Cause: ${err.cause}`,
					`- Stacktrace:`,
					`${err.stack}`,
				].join('\n'),
			)}`,
		);
	}

	#flush(msg: string) {
		const data = fs.existsSync(this.file) ? `${fs.readFileSync(this.file)}\n` : '';
		// eslint-disable-next-line no-control-regex
		fs.writeFileSync(this.file, `${data}${msg.replaceAll(/\x1b\[[0-9;]*m/g, '')}`, 'utf8');
	}
}
