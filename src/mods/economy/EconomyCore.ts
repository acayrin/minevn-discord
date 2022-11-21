import Yujin from '../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'EconomyCore',
			group: 'Economy',
			description: 'Base economy mod',
			priority: 999,
			events: {
				onInit: async (mod) => {
					if (!this.getConfig())
						this.generateConfig({
							currency: 'mvn_coin',
							bet: {
								min: 0,
								max: 100_000,
							},
						});

					const config = this.getConfig();
					mod.bot.database.set(
						'economy',
						mod,
						{
							database: mod.getDatastore(),
							currency: mod.bot.client.getEmoji(config.currency)?.shift() || '🪙',
						},
						{
							public: true,
						},
					);

					mod.bot.info(
						`[${this.name}] Using ${
							config.currency ? `default currency ${config.currency}` : `fallback currency 🪙`
						}`,
					);

					mod.bot.info(
						`[${this.name}] Min bet ${config.bet?.min !== undefined ? config.bet?.min : 0} (${
							config.bet?.min !== undefined ? 'config' : 'fallback'
						})`,
					);

					mod.bot.info(
						`[${this.name}] Max bet ${config.bet?.max !== undefined ? config.bet?.max : 0} (${
							config.bet?.max !== undefined ? 'config' : 'fallback'
						})`,
					);
				},

				onMsgCreate: async (message, opt): Promise<unknown> => {
					if (message.author.bot || message.webhookID) return;

					if (Math.random() <= 0.5) {
						const { database } = opt.mod.bot.database.get('economy', opt.mod);
						const data = {
							db: database as Yujin.Datastore,
							amount: Math.floor(Math.random() * 9) + 1,
						};

						// set default
						if (!data.db.get(message.author.id))
							data.db.set({
								key: message.author.id,
								value: 0,
							});

						data.db.set({
							key: message.author.id,
							value: (data.db.get(message.author.id) || 0) + data.amount,
						});
					}
				},
			},
		});
	}
}
