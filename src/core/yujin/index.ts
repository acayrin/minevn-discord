import Eris from 'eris';
import '../prototype';
import BaseBot from './bot';
import { BaseDatastore } from './datastore';
import { BaseLauncher } from './launcher/Launcher';
import { BaseMod } from './mod';
import { TempDatabase } from './tempdb';

export namespace Yujin {
	/**
	 * Yujin Bot instance
	 *
	 * @export
	 * @class Bot
	 * @typedef {Bot}
	 * @extends {BaseBot}
	 */
	export class Bot extends BaseBot {}

	/**
	 * Yujin Datastore for storing data in a JSON-based key-value file
	 *
	 * @export
	 * @class Datastore
	 * @typedef {Datastore}
	 * @extends {BaseDatastore}
	 */
	export class Datastore extends BaseDatastore {}

	/**
	 * Yujin mod instance
	 *
	 * @export
	 * @class Mod
	 * @typedef {Mod}
	 * @extends {BaseMod}
	 */
	export class Mod extends BaseMod {}

	/**
	 * Temporary in memory key-value database
	 *
	 * @export
	 * @class TempDB
	 * @typedef {TempDB}
	 * @template T = unknown
	 * @extends {TempDatabase<T>}
	 */
	export class TempDB<T = unknown> extends TempDatabase<T> {}

	/**
	 * Yujin bot Launcher
	 *
	 * @export
	 * @class Launcher
	 * @typedef {Launcher}
	 * @extends {BaseLauncher}
	 */
	export class Launcher extends BaseLauncher {}

	export interface ClusterQueueObject {
		clusterId: number;
		value: {
			payload: 'connect';
			clusterId: number;
			totalClusters: number;
			firstShardID: number;
			lastShardID: number;
			totalShards: number;
			token: string;
			initFile: string;
			clientOptions: import('eris').ClientOptions;
		};
	}

	export interface IPCEvents {
		_eventName: string;
		msg?: any;
	}

	export interface ProcessEventsPartials {
		payload: string;
		msg?: any;
		[key: string]: any;
	}

	export interface ProcessConnectPayload extends ProcessEventsPartials {
		payload: 'connect';
		clusterId: number;
		totalClusters: number;
		firstShardID: number;
		lastShardID: number;
		totalShards: number;
		token: string;
		initFile: string;
		clientOptions: import('eris').ClientOptions;
	}

	export interface BaseClassProps {
		client: import('eris').Client;
		ipc: import('../yujin/cluster/classes/IPC').default;
		clusterID: number;
	}

	export interface MasterStats {
		guilds: number;
		users: number;
		ram: number;
		voice: number;
		exclusiveGuilds: number;
		largeGuilds: number;
		clusters: ClusterStats[];
		clustersCounted: number;
		shards: ShardStats[];
		shardsCounted: number;
	}

	export interface ClusterStats {
		clusterID: number;
		guilds: number;
		users: number;
		ram: number;
		voice: number;
		uptime: number;
		exclusiveGuilds: number;
		largeGuilds: number;
		shards: number;
		shardsStats: ShardStats[];
	}

	export interface IPCEvent {
		isSingleUse?: boolean;
		cb: (msg: IPCEvents) => void;
	}

	export interface IPCEventListener {
		removeListener: () => void;
		index: number;
		eventName: string;
	}

	export interface ShardStats {
		shardId: number;
		ready: boolean;
		latency: number;
		status: string;
	}

	export interface IPCInterface {
		register(event: string, callback: (msg: IPCEvents) => void): IPCEventListener;
		unregister(event: string): void;
		broadcast(event: string, message: { [key: string]: any }): void;
		sendTo(clusterID: number, event: string, message: { [key: string]: any }): void;
	}

	export interface ClusterManagerOptions {
		totalShards?: number;
		totalClusters?: number;
		firstShardID?: number;
		lastShardID?: number;
		clusterTimeout?: number;
		statsInterval?: number;
		guildsPerShard?: number;
		clientOptions?: Eris.ClientOptions;
	}

	export interface ClusterMessages {
		clusterID: number;
		message: string;
		shards: number[];
		[key: string]: any;
	}

	export interface ClusterError extends ClusterMessages {
		error: {
			name: string;
			message: string;
			cause: string;
			stack: string;
		};
	}

	export interface ShardMessages {
		clusterID: number;
		message: string;
		shard: number;
		shards: number[];
		[key: string]: any;
	}

	export interface ShardError extends ShardMessages {
		error: {
			name: string;
			message: string;
			cause: string;
			stack: string;
		};
	}

	export interface ManagerEvents {
		stats: [MasterStats];
		clusterInfo: [ClusterMessages];
		clusterWarn: [ClusterMessages];
		clusterError: [ClusterError];
		shardConnect: [ShardMessages];
		shardDisconnect: [ShardMessages];
		shardReady: [ShardMessages];
		shardResume: [ShardMessages];
		shardInfo: [ShardMessages];
		shardWarn: [ShardMessages];
		shardError: [ShardMessages];
		info: [string];
		error: [any];
	}
}

export default Yujin;
