import Yujin from '../../..';

export class EventBase {
	/**
	 * @description Event name
	 * @author acayrin
	 * @type {string}
	 * @memberof EventBase
	 */
	name: string;

	/**
	 * @description Event description
	 * @author acayrin
	 * @type {string}
	 * @memberof EventBase
	 */
	description: string;

	/**
	 * @description Event to listen for
	 * @author acayrin
	 * @type {string}
	 * @memberof EventBase
	 */
	event: string;

	/**
	 * @description Event process callback
	 * @author acayrin
	 * @memberof EventBase
	 */
	process: (...opt: unknown[]) => Promise<unknown>;

	/**
	 * @description Bot instance that this event is bound to
	 * @author acayrin
	 * @protected
	 * @type {Yujin.Bot}
	 * @memberof EventBase
	 */
	protected bot: Yujin.Bot;

	/**
	 * @description Bind event to a Bot instance
	 * @author acayrin
	 * @param {Yujin.Bot} bot
	 * @memberof EventBase
	 */
	bind = (bot: Yujin.Bot) => {
		this.bot = bot;
	};

	/**
	 * Create a new base Event
	 * @author acayrin
	 * @param {{ name: string; description: string; event: string; process: (...opt: unknown[]) => Promise<unknown> }} opt
	 * @memberof EventBase
	 */
	constructor(opt: {
		name: string;
		description: string;
		event: string;
		process: (...opt: unknown[]) => Promise<unknown>;
	}) {
		this.name = opt.name;
		this.description = opt.description;
		this.event = opt.event;
		this.process = opt.process;
	}
}
