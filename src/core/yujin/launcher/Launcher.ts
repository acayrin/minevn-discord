import 'dotenv/config';
import Eris from 'eris';
import Yujin from '..';
import { Logger } from '../../utils/logger';
import Manager from '../cluster/classes/Manager';

export class BaseLauncher {
	#logger = new Logger({ headless: true });
	#clientOptions: Eris.ClientOptions;
	#clusterOptions: Yujin.ClusterManagerOptions;

	/**
	 * Create an instance of Yujin launcher
	 * @param o Launch options
	 */
	constructor(o?: { clientOptions?: Eris.ClientOptions; clusterOptions?: Yujin.ClusterManagerOptions }) {
		this.#clientOptions = o?.clientOptions;
		this.#clusterOptions = o?.clusterOptions;
	}

	/**
	 * Start Yujin in single mode, enough for small amount of servers
	 */
	startSingle() {
		new Yujin.Bot(undefined, this.#clientOptions).init();
	}

	/**
	 * Start Yujin in cluster mode, for large amount of guilds
	 */
	startCluster() {
		const manager = new Manager(process.env.YUJIN_TOKEN, `/dist/core/yujin/bot/index.js`, this.#clusterOptions);

		manager.on('clusterInfo', (m: Yujin.ClusterMessages) => {
			this.#logger.info(`[Cluster (${m.shards[0]}-${m.shards[1]})] ${m.message}`);
		});
		manager.on('clusterWarn', (m: Yujin.ClusterMessages) => {
			this.#logger.warn(`[Cluster (${m.shards[0]}-${m.shards[1]})] ${m.message}`);
		});
		manager.on('clusterError', (m: Yujin.ClusterMessages) => {
			this.#logger.error({
				name: `Cluster (${m.shards[0]}-${m.shards[1]})`,
				message: m.error.message,
				cause: m.error.cause,
				stack: m.error.stack,
			});
		});
		manager.on('stats', (m: Yujin.MasterStats) => {
			this.#logger.info(
				`[Healthcheck] Clusters: ${m.clustersCounted} - Shards: ${m.shardsCounted} - Memory: ${Math.round(
					m.ram * 0.00000095367432,
				)} MB - Guilds: ${m.guilds}`,
			);
		});
		manager.on('shardInfo', (m: Yujin.ShardMessages) => {
			this.#logger.info(
				[
					m.shard !== undefined ? `[Shard (${m.shard})]` : `[Client (${m.shards[0]}-${m.shards[1]})]`,
					m.message,
				].join(' '),
			);
		});
		manager.on('shardWarn', (m: Yujin.ShardMessages) => {
			this.#logger.warn(
				[
					m.shard !== undefined ? `[Shard (${m.shard})]` : `[Client (${m.shards[0]}-${m.shards[1]})]`,
					m.message,
				].join(' '),
			);
		});
		manager.on('shardError', (m: Yujin.ShardError) => {
			this.#logger.error({
				name: m.shard !== undefined ? `Shard (${m.shard})` : `Client (${m.shards[0]}-${m.shards[1]})`,
				message: m.error.message,
				cause: m.error.cause,
				stack: m.error.stack,
			});
		});
		manager.on('shardConnect', (m: Yujin.ShardMessages) => {
			this.#logger.info(`[Shard (${m.shard})] Shard connected`);
		});
		manager.on('shardDisconnect', (m: Yujin.ShardMessages) => {
			this.#logger.info(`[Shard (${m.shard})] Shard disconnected`);
		});

		manager.launch();
	}
}
