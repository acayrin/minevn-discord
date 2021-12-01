import * as chalk from 'chalk'

class Logger {
    private time = (new Date()).toLocaleString()

    public debug = (msg: string) => {
        console.log(`${chalk.gray(`[${this.time} - DEBUG] ${msg}`)}`)
    }
    public log = (msg: string) => {
        console.log(`[${this.time} - INFO] ${msg}`)
    }

    public warn = (msg: string) => {
        console.log(`${chalk.yellow(`[${this.time} - WARN] ${msg}`)}`)
    }

    public error = (msg: string) => {
        console.log(`${chalk.red(`[${this.time} - ERROR] ${msg}`)}`)
    }
}

export { Logger }