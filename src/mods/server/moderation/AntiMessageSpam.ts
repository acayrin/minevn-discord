import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	#history: Map<string, { id: string; timestamp: number }[]> = new Map();
	#incremental: Map<string, { amount: number; interval: NodeJS.Timeout }> = new Map();

	constructor() {
		super({
			name: 'Anti Message Spam',
			group: ['Server', 'Moderation'],
			author: 'acayrin',
			intents: ['guilds', 'guildMessages', 'guildMembers'],
			description: 'Prevent users from spamming messages',
			priority: 9999,
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateConfig({
							amount: 6,
							duration: 3,
							timeout_duration: 60,
							delete_messages: false,
							incremental: {
								enable: true,
								multiplier: 2,
							},
						});
				},
				onMsgCreate: async (msg) => {
					if (msg.webhookID || msg.author.bot || msg.member.permissions.has('manageMessages')) return;

					if (!this.#history.has(msg.author.id)) {
						this.#history.set(msg.author.id, []);
					}

					const get = this.#history.get(msg.author.id);
					const config: {
						amount: number;
						duration: number;
						timeout_duration: number;
						delete_messages: boolean;
						incremental: {
							enable: boolean;
							multiplier: number;
						};
					} = this.getConfig();
					if (get.length === config.amount) {
						get.shift();
					}
					get.push({ id: msg.id, timestamp: msg.timestamp });
					this.#history.set(msg.author.id, get);

					if (
						get.length === config.amount &&
						get.at(-1).timestamp - get.at(0).timestamp < config.duration * 1e3
					) {
						// incremental
						if (config.incremental?.enable) {
							this.#incremental.set(msg.author.id, {
								amount: this.#incremental.has(msg.author.id)
									? this.#incremental.get(msg.author.id).amount * (config.incremental.multiplier || 2)
									: 1,
								interval: this.#incremental.get(msg.author.id)?.interval,
							});
						}

						// bulk delete
						if (config.delete_messages) {
							const msgs: string[] = [];
							get.map((item) => msgs.push(item.id));
							try {
								await this.bot.client.deleteMessages(
									msg.channel.id,
									msgs,
									'Automated deletion due to message spam',
								);
							} catch (e) {
								this.bot.warn(
									`[${this.name}] Failed to bulk delete messages of user '${msg.author.id}'\n${e}`,
								);
							}
						}

						// warn
						await msg.member
							.edit({
								communicationDisabledUntil: new Date(
									Date.now() +
										config.timeout_duration *
											1e3 *
											(this.#incremental.get(msg.author.id)?.amount || 1),
								),
							})
							.then(async () => {
								await msg.channel.createMessage(
									`${msg.author.mention} do not spam! (limit ${config.amount}/${config.duration}s)`,
								);
							})
							.catch((e) => {
								this.bot.warn(
									`[${this.name}] Unable to timeout user ${msg.author.id} reason: ${e.message}`,
								);
							})
							.finally(() => {
								this.#history.delete(msg.author.id);

								if (this.#incremental.get(msg.author.id)?.interval) {
									clearInterval(this.#incremental.get(msg.author.id)?.interval);
								}

								this.#incremental.set(msg.author.id, {
									amount: this.#incremental.get(msg.author.id).amount,
									interval: setTimeout(() => {
										this.#incremental.delete(msg.author.id);
									}, config.timeout_duration * 2e3 * (this.#incremental.get(msg.author.id).amount || 1)),
								});
							});
					}
				},
			},
		});
	}
}
