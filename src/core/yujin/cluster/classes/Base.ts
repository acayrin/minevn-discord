import { Client } from 'eris';
import Yujin from '../..';

export default class Base {
	public client: Client;
	public ipc: import('./IPC').default;
	public clusterID: number;
	constructor(setup: Yujin.BaseClassProps) {
		this.client = setup.client;
		this.ipc = setup.ipc;
		this.clusterID = setup.clusterID;
	}
	public init(): void {
		throw new Error('Extended base class must include init method');
	}
}
