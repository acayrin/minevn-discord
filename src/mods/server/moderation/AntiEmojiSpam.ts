import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	#regex = new RegExp(/(<a?):\w+:(\d{18}>)/gimu);
	#incremental: Map<string, { amount: number; interval: NodeJS.Timeout }> = new Map();

	constructor() {
		super({
			name: 'Anti Emoji Spam',
			group: ['Server', 'Moderation'],
			author: 'acayrin',
			intents: ['guilds', 'guildMessages', 'guildMembers'],
			description: 'Prevent users from spamming emojis',
			priority: 9999,
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateDefaultConfig({
							no_text: {
								emote_amount: 10,
							},
							with_text: {
								text_min_length: 20,
								emote_amount: 20,
							},
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
						no_text: {
							emote_amount: number;
						};
						with_text: {
							text_min_length: number;
							emote_amount: number;
						};
						timeout_duration: number;
						delete_messages: boolean;
						incremental: {
							enable: boolean;
							multiplier: number;
						};
					} = this.getConfig();
					const emote_matches = msg.content.match(this.#regex);
					const cases = {
						no_text:
							emote_matches?.length >= config.no_text.emote_amount &&
							msg.content.replace(this.#regex, '').trim().length <= config.with_text.text_min_length,
						with_text:
							emote_matches?.length >= config.with_text.emote_amount &&
							msg.content.replace(this.#regex, '').trim().length >= config.with_text.text_min_length,
					};

					if (cases.no_text || cases.with_text) {
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
									[
										`${msg.author.mention} do not spam emotes!`,
										cases.no_text
											? `(limit ${config.no_text.emote_amount}/<${config.with_text.text_min_length})`
											: `(limit ${config.with_text.emote_amount}/>${config.with_text.text_min_length})`,
									].join(' '),
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
