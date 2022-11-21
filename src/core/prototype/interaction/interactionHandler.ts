import Eris from 'eris';

import { EventEmitter } from 'events';

declare module 'eris' {
	export interface Message {
		/**
		 * Create a new message interaction listener
		 * @param options Additional options for this listener
		 * @returns
		 */
		interactionHandler: (options?: {
			permanent?: boolean;
			filter?: (e: Eris.ComponentInteraction) => boolean;
			time?: number;
			maxMatches?: number;
		}) => InteractionHandler;
	}
}

Eris.Message.prototype.interactionHandler = function (
	this: Eris.Message,
	options?: {
		permanent: boolean;
		filter?: (e: Eris.ComponentInteraction) => boolean;
		time?: number;
		maxMatches?: number;
	},
) {
	return new InteractionHandler(this, options);
};

class InteractionHandler extends EventEmitter {
	client: Eris.Client;
	message: Eris.Message<Eris.TextableChannel>;
	options: { filter?: (e: Eris.ComponentInteraction) => boolean; time?: number; maxMatches?: number };
	permanent: boolean;
	ended: boolean;
	collected: unknown[];
	listener: (interaction: Eris.ComponentInteraction) => boolean;

	constructor(
		message: Eris.Message,
		options?: {
			permanent?: boolean;
			filter?: (e: Eris.ComponentInteraction) => boolean;
			time?: number;
			maxMatches?: number;
		},
	) {
		super();

		this.client = message.guild() ? message.guild().shard.client : message.channel.client;
		this.message = message;
		this.options = options;
		this.permanent = options?.permanent || false;
		this.ended = false;
		this.collected = [];
		this.listener = (interaction: Eris.ComponentInteraction) => this.processInteraction(interaction);

		this.client.on('interactionCreate', this.listener);

		if (options?.time) {
			setTimeout(() => this.stopListening('time'), options?.time || 300_000);
		}
	}

	/**
	 * Verify a reaction for its validity with provided filters
	 * @param {object} interaction The iteraction object
	 */
	processInteraction(interaction: Eris.ComponentInteraction) {
		if (this.message.id !== interaction.message.id) {
			return false;
		}

		if (this.options?.filter && !this.options.filter(interaction)) {
			interaction.createMessage({
				content: 'This is not your message',
				flags: 64,
			});
			return false;
		}

		this.collected.push({ interaction });
		this.emit('interaction', interaction);

		if (this.options?.maxMatches && this.collected.length >= this.options.maxMatches) {
			this.stopListening('maxMatches');
			return true;
		}

		return false;
	}

	/**
	 * Stops collecting reactions and removes the listener from the client
	 * @param {string} reason The reason for stopping
	 */
	stopListening(reason: string) {
		if (this.ended) {
			return;
		}

		this.ended = true;

		if (!this.permanent) {
			this.client.removeListener('interactionCreate', this.listener);
		}

		this.emit('end', this.collected, reason);
	}
}
