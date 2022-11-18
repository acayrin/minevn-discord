import fetch from 'node-fetch';

import Yujin from '../../../core/yujin';

export let SRA_state = true;
export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Image Backend Check',
			group: 'Unknown',
			description: 'API check for image related commands',
			events: {
				onInit: async () => {
					setInterval(() => {
						fetch('https://some-random-api.ml/')
							.then((e) => {
								SRA_state = e.status === 200;
							})
							.catch(() => {
								SRA_state = false;
							});
					}, 10_000);
				},
			},
		});
	}
}
