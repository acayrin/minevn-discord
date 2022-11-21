import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	#incremental: Map<string, { amount: number; interval: NodeJS.Timeout }> = new Map();

	constructor() {
		super({
			name: 'Anti Attachment Spam',
			group: ['Server', 'Moderation'],
			author: 'acayrin',
			intents: ['guilds', 'guildMessages', 'guildMembers'],
			description: 'Prevent users from spamming attachments',
			priority: 9999,
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateConfig({
							amount: 4,
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

					const config: {
						amount: number;
						timeout_duration: number;
						delete_messages: boolean;
						incremental: {
							enable: boolean;
							multiplier: number;
						};
					} = this.getConfig();

					if (msg.attachments?.length > config.amount) {
						// incremental
						if (config.incremental?.enable) {
							this.#incremental.set(msg.author.id, {
								amount: this.#incremental.has(msg.author.id)
									? this.#incremental.get(msg.author.id).amount * (config.incremental.multiplier || 2)
									: 1,
								interval: this.#incremental.get(msg.author.id)?.interval,
							});
						}

						// edit
						msg.member
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
									`${msg.author.mention} do not spam attachments! (limit ${config.amount})`,
								);
							})
							.catch((e) => {
								this.bot.warn(
									`[${this.name}] Unable to timeout user ${msg.author.id} reason ${e.message}`,
								);
							})
							.finally(() => {
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
