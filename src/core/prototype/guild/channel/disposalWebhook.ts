import Eris from 'eris';

declare module 'eris' {
	export interface TextChannel {
		/**
		 * Send a one-time webhook message, generally slower then fetching existing ones but safer
		 * @param payload Webhook payload
		 * @param hookOptions Additional webhook options
		 * @returns
		 */
		disposalWebhook: (
			payload: Eris.WebhookPayload,
			hookOptions?: {
				name: string;
				avatar: string;
			},
		) => Promise<void>;
	}
}

Eris.TextChannel.prototype.disposalWebhook = async function (
	this: Eris.TextChannel,
	payload: Eris.WebhookPayload,
	hookOptions?: {
		name: string;
		avatar: string;
	},
) {
	const h = await this.createWebhook(
		hookOptions || {
			name: this.client.user.tag(),
			avatar: this.client.user.avatarURL,
		},
	);

	if (h.token) await this.client.executeWebhook(h.id, h.token, payload);
	await this.client.deleteWebhook(h.id, h.token);
};
