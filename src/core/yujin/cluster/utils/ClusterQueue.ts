import { EventEmitter } from 'events';
import Yujin from '../..';

class ClusterQueue extends EventEmitter {
	public queue: Yujin.ClusterQueueObject[] = [];
	constructor() {
		super();
	}

	/**
	 * Attempts to start shards in first cluster in queue if one
	 * @returns
	 */
	public startShards(): void {
		const cluster = this.queue[0];
		if (!cluster) return;
		this.emit('startShards', cluster);
	}

	/**
	 * Queues a new cluster of shards and starts it if none are in the queue
	 * @param item Cluster info item
	 */
	public queueShards(item: Yujin.ClusterQueueObject): void {
		if (this.queue.length === 0) {
			this.queue.push(item);
			this.startShards();
		} else {
			this.queue.push(item);
		}
	}
}

export default ClusterQueue;
