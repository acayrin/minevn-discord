import Eris from 'eris';
import { EventEmitter } from 'events';
const collectors: MessageCollector[] = [];

class MessageCollector extends EventEmitter {
	filter: (message: Eris.Message<Eris.PossiblyUncachedTextableChannel>) => boolean;
	channel: Eris.Channel;
	options: { time?: number; maxMatches?: number };
	ended: boolean;
	collected: Eris.Message<Eris.PossiblyUncachedTextableChannel>[];

	constructor(
		channel: Eris.Channel,
		filter: (message: Eris.Message<Eris.PossiblyUncachedTextableChannel>) => boolean,
		options: { time?: number; maxMatches?: number },
	) {
		super();
		this.filter = filter;
		this.channel = channel;
		this.options = options;
		this.ended = false;
		this.collected = [];

		collectors.push(this);
		if (options.time) setTimeout(() => this.stop('time'), options.time);
	}

	verify(message: Eris.Message<Eris.PossiblyUncachedTextableChannel>) {
		if (this.channel.id !== message.channel.id) return false;
		if (this.filter(message)) {
			this.collected.push(message);

			this.emit('message', message);
			if (this.options.maxMatches && this.collected.length >= this.options.maxMatches) this.stop('maxMatches');
			return true;
		}

		return false;
	}

	stop(reason: string) {
		if (this.ended) return;
		this.ended = true;

		collectors.splice(collectors.indexOf(this), 1);
		this.emit('end', this.collected, reason);
	}
}

/**
 * Create a message listener in this channel
 * @param options Options to apply to this message listener
 * @returns
 */
export const awaitMessages = (options: {
	channel: Eris.TextableChannel;
	filter: (message: Eris.Message<Eris.PossiblyUncachedTextableChannel>) => boolean;
	client: Eris.Client;
	time?: number;
	maxMatches?: number;
}) => {
	let l = false;
	if (!l) {
		options.client.on('messageCreate', (msg) => {
			for (const collector of collectors) collector.verify(msg);
		});

		l = true;
	}

	const collector = new MessageCollector(options.channel, options.filter, options);
	return new Promise((resolve) => collector.on('end', resolve));
};
