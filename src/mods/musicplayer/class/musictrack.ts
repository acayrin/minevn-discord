import { GuildMember } from "discord.js";

/**
 * A music track
 *
 * @export
 * @class MusicTrack
 */
export class MusicTrack {
	/**
	 * Track's title
	 *
	 * @type {string}
	 * @memberof MusicTrack
	 */
	public readonly name: string;

	/**
	 * Track's url
	 *
	 * @type {string}
	 * @memberof MusicTrack
	 */
	public readonly url: string;

	/**
	 * Track's total duration
	 *
	 * @type {number}
	 * @memberof MusicTrack
	 */
	public readonly duration: number;

	/**
	 * Track author's channel
	 *
	 * @type {string}
	 * @memberof MusicTrack
	 */
	public readonly channel: string;

	/**
	 * Track requester
	 *
	 * @type {GuildMember}
	 * @memberof MusicTrack
	 */
	public readonly requester: GuildMember;

	/**
	 * Creates an instance of MusicTrack.
	 * @param {string} name track title
	 * @param {string} url track url
	 * @param {number} duration track duration
	 * @param {string} channel track channel
	 * @param {GuildMember} requester track requester
	 * @memberof MusicTrack
	 */
	constructor(name: string, url: string, duration: number, channel: string, requester: GuildMember) {
		this.name = name;
		this.url = url;
		this.duration = duration;
		this.channel = channel;
		this.requester = requester;
	}
}
