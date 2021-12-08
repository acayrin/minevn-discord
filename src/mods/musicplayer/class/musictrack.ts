import { GuildMember } from "discord.js";

export class MusicTrack {
	public readonly name: string;
	public readonly url: string;
	public readonly duration: number;
	public readonly channel: string;
	public readonly author: GuildMember;

	/**
	 * Creates an instance of MusicTrack.
	 * @param {string} name track title
	 * @param {string} url track url
	 * @param {number} duration track duration
	 * @param {string} channel track channel
	 * @param {GuildMember} author track requester
	 * @memberof MusicTrack
	 */
	constructor(name: string, url: string, duration: number, channel: string, author: GuildMember) {
		this.name = name;
		this.url = url;
		this.duration = duration;
		this.channel = channel;
		this.author = author;
	}
}
