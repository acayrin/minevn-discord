import Eris from 'eris';

declare module 'eris' {
	export interface TextChannel {
		/**
		 * Get a webhook or all from this channel
		 * @param id ID of the webhook, if not return all webhooks from this channel
		 * @returns
		 */
		getWebhook: (id?: string) => Promise<Eris.Webhook | Eris.Webhook[] | undefined>;
	}
}

Eris.TextChannel.prototype.getWebhook = async function (this: Eris.TextChannel, id?: string) {
	const webhooks = await this.guild.getWebhooks();
	const list: Eris.Webhook[] = [];

	for (const webhook of webhooks) {
		if (webhook.channel_id === this.id) {
			if (webhook.id === id) return webhook;
			list.push(webhook);
		}
	}

	return list.length > 0 ? list : undefined;
};
