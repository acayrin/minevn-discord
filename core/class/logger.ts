import * as chalk from "chalk";

/**
 * A Console Logger
 *
 * @class Logger
 */
class Logger {
    /**
     * Local time string
     *
     * @private
     * @memberof Logger
     */
    private time = new Date().toLocaleString();

    /**
     * Print a debug message
     *
     * @param {string} msg
     * @memberof Logger
     */
    public debug = (msg: string) => {
        console.log(`${chalk.gray(`[${this.time} - DEBUG] ${msg}`)}`);
    };

    /**
     * Print an info message
     *
     * @param {string} msg
     * @memberof Logger
     */
    public log = (msg: string) => {
        console.log(`[${this.time} - INFO] ${msg}`);
    };

    /**
     * Print a warning message
     *
     * @param {string} msg
     * @memberof Logger
     */
    public warn = (msg: string) => {
        console.log(`${chalk.yellow(`[${this.time} - WARN] ${msg}`)}`);
    };

    /**
     * Print an error message
     *
     * @param {string} msg
     * @memberof Logger
     */
    public error = (msg: string) => {
        console.log(`${chalk.red(`[${this.time} - ERROR] ${msg}`)}`);
    };
}

export { Logger };
