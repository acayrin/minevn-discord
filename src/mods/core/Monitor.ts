import { spawnSync } from 'child_process';
import Eris from 'eris';
import { build_chart } from '../../core/utils/chart';

import Yujin from '../../core/yujin';

export let seen: {
	id: string;
	count: number;
}[] = [];
const process_usage: {
	cpu: number[];
	mem: number[];
} = {
	cpu: [],
	mem: [],
};

export default class extends Yujin.Mod {
	#stats: Yujin.MasterStats;

	constructor() {
		super({
			name: 'Process Monitor',
			group: 'Core',
			description: 'Yujin bot process monitor',
			author: 'acayrin',
			intents: ['guilds'],
			commands: [
				{
					name: 'monitor',
					description: 'Yujin bot process monitor',
					type: 'message',
					usage: '%prefix%%command% [user]',
					process: async (message, opt) => {
						if (opt.args.length > 0) {
							opt.args.forEach(async (arg) => {
								arg = arg.replace(/[^a-zA-Z0-9]/g, '');
								const u = message.guild().getUser(arg);
								if (!u) return;

								const l = seen.find((m) => m.id === u.id);
								if (l) {
									message.channel.createMessage(
										`User **${u.user.username}#${u.user.discriminator}** had sent **${l.count}** messages today`,
									);
								}
							});
							return;
						}

						// perm specific
						if (!message.member.permissions.has('manageGuild')) return;

						const data = {
							messages: 0,
							time_start: new Date(0),
							time_client_uptime: new Date(0),
							memory: Number(
								spawnSync(`pmap -x ${process.pid} | tail -n 1 | awk '/[0-9]/{print $4}' `).toString(),
							),
							cpu: Number(spawnSync(`ps -o %cpu ${process.pid} | tail -n 1`).toString().trim()),
						};
						seen.forEach((c) => (data.messages += c.count));
						data.time_start.setSeconds(process.uptime());
						data.time_client_uptime.setSeconds(Math.floor(opt.mod.bot.client.uptime / 1000));

						await message.reply({
							embed: new Eris.Embed()
								.setTitle('Process monitor')
								.setDescription(
									`Running on ${process.platform}_${process.arch} with node ${process.version}\n`,
								)
								.setColor(opt.mod.bot.color)
								.addField('CLUSTERS', `${this.#stats?.clustersCounted}`, true)
								.addField('\u200B', '\u200B', true)
								.addField('SHARDS', `${this.#stats?.shardsCounted}`, true)
								// uptime
								.addField(
									'UPTIME (Con)',
									`${data.time_client_uptime.toISOString().substr(11, 8)}`,
									true,
								)
								.addField('\u200B', '\u200B', true)
								.addField('UPTIME (Proc)', data.time_start.toISOString().substr(11, 8), true)
								// today interactions
								.addField('MESSAGES', `${data.messages} msgs`, true)
								.addField('\u200B', '\u200B', true)
								.addField('USERS', `${seen.length} users`, true)
								// resource usage
								.addField(
									`CPU (1m / 5m / 15m)`,
									`${avg_of_range(process_usage.cpu, 6)} % /` +
										` ${avg_of_range(process_usage.cpu, 60)} % /` +
										` ${avg_of_range(process_usage.cpu, 90)} %`,
									true,
								)
								.addField('\u200B', '\u200B', true)
								.addField(
									`MEM (1m / 5m / 15m)`,
									`${avg_of_range(process_usage.mem, 6)} Mb /` +
										` ${avg_of_range(process_usage.mem, 60)} Mb /` +
										` ${avg_of_range(process_usage.mem, 90)} Mb`,
									true,
								)
								// chart
								.addField('\u200B', build_chart(process_usage.cpu.slice(-18)), true)
								.addField('\u200B', '\u200B', true)
								.addField('\u200B', build_chart(process_usage.mem.slice(-18)), true),
						});
					},
				},
			],
			events: {
				onInit: async (mod) => {
					mod.bot.ipc.register('stats', (msg) => {
						this.#stats = msg.msg;
					});

					setInterval(() => {
						const t = new Date()
							.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
							.split(',')[0]
							.split(':');
						if (Number(t[0]) === 0 && Number(t[1]) === 0 && Number(t[2]) === 0) {
							mod.bot.info('[ProcMon] Reached a new day, restarting data.');
							seen = [];
							/**
							process.on("exit", function () {
								require("child_process").spawn(process.argv.shift(), process.argv, {
									cwd: process.cwd(),
									detached: false,
									stdio: "inherit",
								});
							});
							process.exit(); */
						}
					}, 500);

					setInterval(() => {
						if (process_usage.cpu.length >= 90) process_usage.cpu.shift();
						process_usage.cpu.push(
							parseFloat(
								spawnSync(`ps -o %cpu ${process.pid} | tail -n 1`, { shell: false }).toString().trim(),
							),
						);

						if (process_usage.mem.length >= 90) process_usage.mem.shift();
						process_usage.mem.push(
							Number(
								spawnSync(`pmap -x ${process.pid} | tail -n 1 | awk '/[0-9]/{print $4}' `).toString(),
							) / 1024,
						);
					}, 10_000);
				},
				onMsgCreate: async (message) => {
					if (message.author.bot) return;

					const g = seen.find((c) => c.id === message.author.id);
					if (!g) {
						seen.push({
							id: message.author.id,
							count: 1,
						});
					} else {
						seen[seen.indexOf(g)] = {
							id: message.author.id,
							count: ++g.count,
						};
					}
				},
			},
		});
	}
}

function avg_of_range(arr: number[], count: number) {
	const orr = arr.slice(-count);
	let res = 0;
	orr.forEach((num) => (res += num));

	return (res / orr.length).toFixed(2);
}
