import Eris from 'eris';
import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	#history: Map<string, number[]> = new Map();

	constructor() {
		super({
			name: 'Anti Webhook Spam',
			group: ['Server', 'Moderation'],
			author: 'acayrin',
			intents: ['guilds', 'guildMessages', 'guildWebhooks'],
			description: 'Prevent webhook from spamming messages\nNote: **this will delete the webhook**',
			priority: 9999,
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateDefaultConfig({
							amount: 6,
							duration: 3,
							only_if_tag_everyone: false,
							ignored_channels: ['916645780327108629', '916648051538538518', '918076409140899870'],
						});
				},
				onMsgCreate: async (msg, opt) => {
					if (!msg.webhookID || this.getConfig().ignored_channels.includes(msg.channel.id)) return;

					if (!this.#history.has(msg.webhookID)) {
						this.#history.set(msg.webhookID, []);
					}

					const get = this.#history.get(msg.webhookID);
					const config: {
						amount: number;
						duration: number;
						only_if_tag_everyone: boolean;
					} = this.getConfig();
					if (get.length === config.amount) {
						get.shift();
					}
					get.push(msg.timestamp);
					this.#history.set(msg.webhookID, get);

					if (get.length === config.amount && get.at(-1) - get.at(0) < config.duration * 1e3) {
						if (
							(config.only_if_tag_everyone && !msg.mentionEveryone) ||
							msg.channel instanceof Eris.ThreadChannel
						)
							return;

						(msg.channel as Eris.TextChannel)
							.getWebhook(msg.webhookID)
							.then((webhooks) => {
								const webhook = Array.isArray(webhooks) ? webhooks.shift() : webhooks;
								opt.mod.bot.client
									.deleteWebhook(webhook.id, webhook.token, 'Automated deletion due to webhook spam')
									.then(() => {
										msg.channel.createMessage(
											`Deleted webhook **${msg.webhookID}** (limit ${config.amount}/${config.duration}s)`,
										);
									})
									.catch((e) => {
										opt.mod.bot.warn(
											`[${this.name}] Failed to delete webhook '${webhook.id}\n${e}`,
										);
									});
							})
							.catch((e) => {
								opt.mod.bot.warn(
									`[${this.name}] Unable to delete webhook ${msg.webhookID} reason: ${e.message}`,
								);
							})
							.finally(() => {
								this.#history.delete(msg.webhookID);
							});
					}
				},
			},
		});
	}
}
