import Yujin from './core/yujin';

new Yujin.Launcher({
	clusterOptions: {
		totalClusters: 1,
		totalShards: 1,
		guildsPerShard: 1_000,
		statsInterval: 30,
		clientOptions: {
			intents: ['all'],
			compress: true,
			defaultImageFormat: 'webp',
			defaultImageSize: 1024,
			messageLimit: 10,
			restMode: true,
		},
	},
}).startCluster();
