import child_process from 'child_process';
import fs from 'fs';
import net from 'net';
import path from 'path';
import process from 'process';
import readline from 'readline';

const __data_dir = `${path.resolve('./')}/.overseer`;

(function () {
	const args = process.argv;
	args.shift(); // node
	args.shift(); // Overseer itself

	args.forEach(() => {
		switch (
			args.shift() // --run
		) {
			case '-r':
			case '--run': {
				const opt: {
					name: string | undefined;
					command: string | undefined;
					restart: boolean;
					webhook: string | undefined;
				} = {
					name: undefined,
					command: '',
					restart: true,
					webhook: '',
				};

				args.forEach(() => {
					const b = args.shift(); // --name
					switch (b) {
						case '-n':
						case '--name': {
							opt.name = args.shift(); // [name]
							break;
						}

						case '--restart': {
							opt.restart = true;
							break;
						}

						case '--webhook': {
							opt.webhook = args.shift(); // [webhook]
							break;
						}
					}
				});

				opt.command = args.join(' ');
				OverseerRun(opt);
				break;
			}
			case '-t':
			case '--terminal': {
				Overseer();
				break;
			}
			default: {
				console.log('Use');
				console.log('  -r/--run [command] to run a background app');
				console.log('  -t/--terminal to run the cli app');
			}
		}
	});
})();

/**
 * @description Main Overseer cli
 * @author acayrin
 */
function Overseer() {
	const cli = readline.createInterface(process.stdin, process.stdout);
	let con: net.Socket | undefined;

	cli.setPrompt('[>] ');

	console.log('[!]');
	console.log('[!] Overseer');
	console.log('[!] - run background apps made easy, i think ');
	console.log('[!]');
	cli.prompt();

	cli.on('line', (line) => {
		const arg = line.split(' ');
		const cmd = arg.shift();
		if (!fs.existsSync(__data_dir)) fs.mkdirSync(__data_dir, { recursive: true });

		switch (cmd) {
			case 'run':
			case 'i': {
				if (arg.length === 0) {
					return console.log('[M] Nothing to run');
				}

				const name = `app_${Date.now()}`;

				child_process
					.spawn('node', [`${__filename}`, '--run', '--name', `${name}`, `${arg.join(' ')}`], {
						stdio: 'ignore',
						detached: true,
					})
					.unref();

				console.log(`[M] Started background task ${arg.join('')}`);

				setTimeout(() => {
					con = net.connect(`${__data_dir}/${name}.socket`);
					console.log(`[M] Connected to ${name}.socket`);
					con.on('data', (d) => {
						d.toString('utf-8')
							.split('\n')
							.forEach((l) => {
								if (l !== '') console.log(`[C] ${l}`);
							});
					});

					fs.watch(`${__data_dir}/${name}.socket`).on('change', () => {
						if (!fs.existsSync(`${__data_dir}/${name}.socket`)) {
							while (con && !con.destroyed) {
								con.destroy();
								con = undefined;
							}
							console.log('[M] Disconnected from app');
						}
					});
				}, 200);
				break;
			}

			case 'connect':
			case 'c': {
				const f = fs.readdirSync(__data_dir).find((p) => p.includes(arg.join('')));
				if (f) {
					try {
						con = net.connect(`${__data_dir}/${f}`);

						console.log(`[M] Connected to ${f}\r`);
						con.on('data', (d) => process.stdout.write(`[C] ${d.toString('utf-8').replace(/\n+/g, '\n')}`));

						fs.watch(`${__data_dir}/${f}`).on('change', () => {
							if (!fs.existsSync(`${__data_dir}/${f}`)) {
								while (con && !con.destroyed) {
									con.destroy();
									con = undefined;
								}
								console.log('[M] Disconnected from app');
							}
						});
					} catch (e) {
						console.log('[M] Unable to connect, is the app working correctly?');
						console.log(e);
					}
				} else {
					console.log('[M] App not found');
				}
				break;
			}

			case 'kill':
			case 'end': {
				if (!con) {
					console.log('[M] Not connected');
				} else {
					con.write(
						JSON.stringify({
							__signal: 'SIGTERM',
						}),
					);
					console.log('[M] Sent SIGTERM to app');
				}
				break;
			}

			case 'list':
			case 'ls': {
				console.log('[M] Available apps:');
				fs.readdirSync(__data_dir).forEach((f) => {
					net.createConnection(`${__data_dir}/${f}`, () => {
						console.log(` + ${f} (active)`);
					})
						.on('error', () => {
							console.log(` + ${f} (dead)`);
						})
						.unref();
				});
				break;
			}

			case 'prune':
			case 'pr': {
				fs.readdirSync(__data_dir).forEach((f) => {
					net.createConnection(`${__data_dir}/${f}`, undefined)
						.on('error', () => {
							fs.rmSync(`${__data_dir}/${f}`, {
								recursive: true,
								force: true,
							});
							console.log(`[M] Removed ${f}`);
						})
						.destroy();
				});
				break;
			}

			case 'disconnect':
			case 'dc': {
				if (con) {
					con.unref();
					con = undefined;
					console.log('[M] Disconnected from app');
				} else {
					console.log('[M] Not connected');
				}
				break;
			}

			case 'exit': {
				while (con) {
					con.unref();
				}
				console.log('[M] Shutting down. Goodbye');
				process.exit();
			}

			// eslint-disable-next-line no-fallthrough
			default: {
				console.log('[M] Usage:');
				console.log('    run/r [command]     - run a command as background app');
				console.log('    connect/c [app]     - connect to an app');
				console.log('    disconnect/dc [app] - disconnect from an app');
				console.log('    kill/end [app]      - kill (send SIGTERM) to an app');
				console.log('    list/ls             - list running apps');
				console.log('    prune/pr            - remove dead apps');
				console.log('    exit                - exit the program');
			}
		}

		cli.prompt();
	});
}

/**
 * @description OverseerRun for running background apps
 * @author acayrin
 * @param {string[]} args
 */
function OverseerRun(opt: {
	name: string | undefined;
	command: string | undefined;
	restart: boolean;
	webhook: string | undefined;
}) {
	const path = `${__data_dir}/${opt.name}.socket`;

	let soc: net.Socket | undefined;
	let cpp: child_process.ChildProcess;
	let tem = false;

	new net.Server((socket) => {
		socket.write(`You're connected to ${opt.name}\n`);
		soc = socket;

		socket.on('close', () => {
			soc = undefined;
		});

		socket.on('data', (data) => {
			const res = JSON.parse(data.toString('utf-8'));
			if (res.__signal && res.__signal.includes('SIGTERM')) {
				socket.write(`Received signal ${res.__signal}\n`);

				process.kill(process.pid, 'SIGTERM');
			}
		});
	}).listen(path);

	const launch = () => {
		try {
			// process
			if (!opt.command) return;
			cpp = child_process.exec(opt.command);
			cpp.stdout?.setEncoding('utf-8');
			cpp.stderr?.setEncoding('utf-8');
			cpp.stdout?.on('data', (d) => soc?.write(d));
			cpp.stderr?.on('data', (d) => soc?.write(d));
			cpp.on('close', (code, signal) => {
				soc?.write(`Process exited ${code} # ${signal}\n`);
				if (!tem) {
					soc?.write('Rebooting...\n');
					launch();
				} else {
					soc?.write('Shutting down process..\n');
				}
			});
		} catch (e) {
			soc?.write(e as string | Uint8Array, undefined);
			process.kill(process.pid, 'SIGTERM');
		}
	};

	launch();
	// clean up directory
	process.on('SIGTERM', () => {
		soc?.write('Shutting down watcher...\n');
		tem = true;
		while (!cpp.kill('SIGTERM')) {
			soc?.write('Waiting for child process to exit...\n');
		}
		fs.rmSync(path, { recursive: true, force: true });
		process.exit(0);
	});
}
