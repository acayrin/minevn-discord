import Eris from "eris";

declare module "eris" {
	export interface TextChannel {
		/**
		 * @description Get a webhook or all
		 * @author acayrin
		 * @param {string} [id] search ID
		 * @returns {(Promise<Eris.Webhook | Eris.Webhook[] | undefined>)} result webhook(s)
		 * @memberof TextChannel
		 */
		getWebhook: (id?: string) => Promise<Eris.Webhook | Eris.Webhook[] | undefined>;
	}
}

Eris.TextChannel.prototype.getWebhook = async function (this: Eris.TextChannel, id?: string) {
	const webhooks = await this.guild.getWebhooks();
	const list: Eris.Webhook[] = [];

	for (const webhook of webhooks) {
		if (webhook.channel_id === this.id) {
			if (webhook.id === id) {
				return webhook;
			} else {
				list.push(webhook);
			}
		}
	}

	return list.length > 0 ? list : undefined;
};
