import { GuildMember } from "discord.js";
import { MusicTrack } from "./class/musictrack";
import ytsr = require("ytsr");
import ytdl = require("ytdl-core");
import ytpl = require("ytpl");

/**
 * Search for videos from youtube
 *
 * @export
 * @param {string} query search query
 * @param {GuildMember} author member who initiated this search
 * @return {*}  {Promise<MusicTrack[]>} list of tracks
 */
export async function search(query: string, author: GuildMember): Promise<MusicTrack[]> {
	const f1 = await ytsr.getFilters(query);
	const f2 = f1.get("Type").get("Video");
	const yt = await ytsr(f2.url, { limit: 10 });
	const res: MusicTrack[] = [];
	yt.items.forEach((item: any) => {
		try {
			res.push(
				new MusicTrack(item["title"], item["url"], toSecs(item["duration"]), item["author"]["name"], author)
			);
		} catch {} // for some reason duration can be null
	});
	return res;
}

/**
 * Parse a playlist url and get its videos
 *
 * @export
 * @param {string} url playlist url
 * @param {GuildMember} member the guild member
 * @return {*}  {Promise<MusicTrack[]>}
 */
export async function parsePlaylist(url: string, member: GuildMember): Promise<MusicTrack[]> {
	const get = await ytpl(url);
	const res: MusicTrack[] = [];
	get.items.forEach((item: any) => {
		res.push(new MusicTrack(item.title, item.shortUrl, item.durationSec, item.author.name, member));
	});
	return res;
}

/**
 * Parse a video url and get its info
 *
 * @export
 * @param {string} url
 * @param {GuildMember} member
 * @return {*}  {Promise<MusicTrack>}
 */
export async function parseVideo(url: string, member: GuildMember): Promise<MusicTrack> {
	const get = (await ytdl.getBasicInfo(url)).videoDetails;

	return new MusicTrack(get.title, get.video_url, Number(get.lengthSeconds), get.author.name, member);
}

/**
 * Convert HH:MM:SS format to seconds
 *
 * @export
 * @param {string} input input string
 * @return {*}  {number} seconds
 */
export function toSecs(input: string): number {
	const arr = input.split(":");
	const ss = Number(arr.pop());
	const mm = arr.length > 0 ? Number(arr.pop()) * 60 : 0;
	const hh = arr.length > 0 ? Number(arr.pop()) * 3600 : 0;
	return ss + mm + hh;
}

/**
 * Convert seconds to HH:MM:SS format
 *
 * @export
 * @param {(string | number)} number seconds
 * @return {*}  {string} formatted string
 */
export function timeFormat(number: string | number): string {
	const ss = Math.floor((Number(number) / 1) % 60);
	const mm = Math.floor((Number(number) / 60) % 60);
	const hh = Math.floor((Number(number) / 3600) % 60);

	return `${hh > 0 ? `${hh}:` : ""}${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

/**
 * Check if input is a valid youtube video url
 *
 * @export
 * @param {string} input
 * @return {*}  {boolean}
 */
export function vVideo(input: string): boolean {
	return ytdl.validateURL(input);
}

/**
 * Check if input is a valid youtube playlist url
 *
 * @export
 * @param {string} input
 * @return {*}  {boolean}
 */
export function vPlaylist(input: string): boolean {
	return ytpl.validateID(input);
}
