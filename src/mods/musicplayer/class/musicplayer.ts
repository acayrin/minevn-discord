import * as Voice from "@discordjs/voice";
import * as Discord from "discord.js";
import { SucklessBot } from "../../../core/sucklessbot";
import { id } from "../../../core/utils/generateid";
import { timeFormat } from "../functions";
import { MusicPlayerLang } from "../lang";
import { MusicManager } from "./musicmanager";
import { MusicTrack } from "./musictrack";
import ytdl = require("ytdl-core");

/**
 * Music player instance
 *
 * @export
 * @class MusicPlayer
 */
export class MusicPlayer {
	/**
	 * Player's unique ID
	 *
	 * @type {string}
	 * @memberof MusicPlayer
	 */
	public readonly id: string = id();

	/**
	 * Player's current audio resource
	 *
	 * @type {Voice.AudioResource<MusicTrack>}
	 * @memberof MusicPlayer
	 */
	public current: Voice.AudioResource<MusicTrack>;

	/**
	 * Current player's queue
	 *
	 * @private
	 * @type {MusicTrack[]}
	 * @memberof MusicPlayer
	 */
	private __queue: MusicTrack[] = [];

	/**
	 * The guild which this player is in
	 *
	 * @private
	 * @type {Discord.Guild}
	 * @memberof MusicPlayer
	 */
	private __guild: Discord.Guild;

	/**
	 * The player's text channel, for responses
	 *
	 * @private
	 * @type {Discord.TextChannel}
	 * @memberof MusicPlayer
	 */
	private __tchannel: Discord.TextChannel;

	/**
	 * The player's voice channel
	 *
	 * @private
	 * @type {(Discord.VoiceChannel | Discord.StageChannel)}
	 * @memberof MusicPlayer
	 */
	private __vchannel: Discord.VoiceChannel | Discord.StageChannel;

	/**
	 * The player's voice connection
	 *
	 * @private
	 * @type {Voice.VoiceConnection}
	 * @memberof MusicPlayer
	 */
	private __connection: Voice.VoiceConnection;

	/**
	 * The player's audio player instance
	 *
	 * @private
	 * @type {Voice.AudioPlayer}
	 * @memberof MusicPlayer
	 */
	private __player: Voice.AudioPlayer;

	/**
	 * The manager which this player is in
	 *
	 * @private
	 * @type {MusicManager}
	 * @memberof MusicPlayer
	 */
	private __manager: MusicManager;

	/**
	 * The Bot instance which owns this player
	 *
	 * @private
	 * @type {SucklessBot}
	 * @memberof MusicPlayer
	 */
	private __bot: SucklessBot;

	/**
	 * Current playback duration
	 *
	 * @private
	 * @type {number}
	 * @memberof MusicPlayer
	 */
	private __playduration: number = 0;

	/**
	 * Player's reconnection attempts
	 *
	 * @private
	 * @type {number}
	 * @memberof MusicPlayer
	 */
	private __reconnectAttempts: number = 0;

	/**
	 * Creates an instance of MusicPlayer.
	 *
	 * @param {Discord.TextChannel | any} tchannel The text channel to send messages in
	 * @param {Discord.VoiceChannel | Discord.StageChannel} vchannel The voice channel to play audio
	 * @param {MusicManager} manager The MusicManager instance for this player
	 * @memberof MusicPlayer
	 */
	constructor(
		tchannel: Discord.TextChannel | any,
		vchannel: Discord.VoiceChannel | Discord.StageChannel,
		manager: MusicManager,
		bot?: SucklessBot
	) {
		if (!(tchannel instanceof Discord.TextChannel)) {
			tchannel.send("This is not a text channel");
			return;
		}
		this.__tchannel = tchannel;
		this.__vchannel = vchannel;
		this.__guild = tchannel.guild;
		this.__manager = manager;
		this.__player = Voice.createAudioPlayer();
		this.__bot = bot;

		this.__connect();
		this.__player.on("error", this.__playerOnError.bind(this));
		this.__player.on("stateChange", this.__playerStateChange.bind(this));
	}

	/**
	 *
	 * Handle when the voice state changes
	 *
	 * If the player was disconnected,
	 *   attempt to reconnect to server,
	 *   after 5 unsuccessful attempts, it enters destroyed state
	 * If the player is in connecting state,
	 *   attempt to mark it as ready,
	 *   else it enters destroyed state
	 * If the player enters destroyed state,
	 *   it will attempt to reconnect using new connection for 5 attempts,
	 *   if not it will destroy itself completely
	 *
	 * @private
	 * @param {*} _
	 * @param {Voice.VoiceConnectionState} newState Connection's new state
	 * @memberof MusicPlayer
	 */
	private __connectionStateChange(_: any, newState: Voice.VoiceConnectionState) {
		if (newState.status === Voice.VoiceConnectionStatus.Disconnected) {
			this.__bot?.emit("debug", `[MusicPlayer - ${this.id}] Player disconnected, attempting to reconnect`);
			Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Connecting, 20e3).catch((e) => {
				if (this.__connection.rejoinAttempts <= 5) {
					this.__bot?.emit(
						"debug",
						`[MusicPlayer - ${this.id}] [A] Attempting to reconnect (${this.__connection.rejoinAttempts}/5)`
					);
					this.__connection.rejoin();
				} else {
					this.__bot?.emit("debug", `[MusicPlayer - ${this.id}] [A] Player encountered an error: ${e}`);
					this.__connection.destroy();
				}
			});
		} else if (
			newState.status === Voice.VoiceConnectionStatus.Connecting ||
			newState.status === Voice.VoiceConnectionStatus.Signalling
		) {
			Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Ready, 20e3).catch((e) => {
				this.__bot?.emit("debug", `[MusicPlayer - ${this.id}] [B] Player encountered an error: ${e}`);
				this.__connection.destroy();
			});
		} else if (newState.status === Voice.VoiceConnectionStatus.Destroyed) {
			if (!this.__vchannel.deleted && this.__reconnectAttempts < 5) {
				this.__reconnectAttempts++;
				this.__bot?.emit(
					"debug",
					`[MusicPlayer - ${this.id}] [B] Attempting to reconnect (${this.__reconnectAttempts}/5)`
				);
				this.__connect();
			} else {
				this.__bot?.emit("debug", `[MusicPlayer - ${this.id}] Player was destroyed`);
				this.__tchannel.send(MusicPlayerLang.PLAYER_DESTROYED);
				this.__manager.remove(this);
			}
		}
	}

	/**
	 *
	 * Handle player's state changes
	 * If player ended its track, continue to next track, if any
	 *
	 * @private
	 * @param {Voice.AudioPlayerState} oldState Player's old state
	 * @param {Voice.AudioPlayerState} newState Player's new state
	 * @memberof MusicPlayer
	 */
	private async __playerStateChange(oldState: Voice.AudioPlayerState, newState: Voice.AudioPlayerState) {
		if (oldState.status !== Voice.AudioPlayerStatus.Idle && newState.status === Voice.AudioPlayerStatus.Idle) {
			// get tracks info
			const bf = this.__queue.shift();
			const af = this.__queue.at(0);

			// delete current track
			this.current = null;
			if (af) {
				if (af.url.includes(bf.url)) {
					await this.__tchannel.send(
						MusicPlayerLang.PLAYER_TRACK_RESUMED.replace(/%track_name%+/g, bf.name).replace(
							/%track_duration%+/g,
							timeFormat(Math.floor(this.__playduration / 1000))
						)
					);
				} else {
					// if 2 tracks are different, reset playback duration
					this.__playduration = 0;

					await this.__tchannel.send(
						MusicPlayerLang.PLAYER_FINISHED.replace(/%track_name%+/g, bf.name).replace(
							/%track_requester%+/g,
							bf.requester.user.tag
						)
					);
					await this.__tchannel.send(
						MusicPlayerLang.PLAYER_STARTED.replace(/%track_name%+/g, af.name).replace(
							/%track_requester%+/g,
							af.requester.user.tag
						)
					);
				}
				setTimeout(() => {
					this.play();
				}, 2e3);
			} else this.__tchannel.send(MusicPlayerLang.PLAYER_QUEUE_ENDED);
		}
	}

	/**
	 *
	 * Handle when player encounters an error
	 * If code 410
	 *     Skip due to age restricting
	 * If code EBML
	 *     Skip due to no suitable audio was found (might be removed)
	 * If code 403/others
	 * 	   Replay current track at timestamp
	 *
	 * @private
	 * @param {Error} e Error encountered
	 * @memberof MusicPlayer
	 */
	private __playerOnError(e: Error) {
		// store current playback duration
		this.__playduration = this.current.playbackDuration;

		// age restricted
		if (e.message.includes("410")) {
			this.__tchannel.send(MusicPlayerLang.ERR_TRACK_AGE_RESTRICTED);

			// no opus audio found
		} else if (e.message.includes("EBML")) {
			this.__tchannel.send(MusicPlayerLang.ERR_TRACK_NO_OPUS);

			// rate limited
		} else if (e.message.includes("403")) {
			this.__tchannel.send(MusicPlayerLang.ERR_TRACK_RATE_LIMITED);
			this.__queue.unshift(this.current.metadata);

			// unknown
		} else {
			this.__tchannel.send(MusicPlayerLang.ERR_TRACK_UNKNOWN.replace(/%error%+/g, e.message));
			this.__queue.unshift(this.current.metadata);
		}

		// debug
		this.__bot?.emit(
			"debug",
			`[MusicPlayer - ${this.id}] PLAYER - Track: ${this.current.metadata.url} (at ${timeFormat(
				Math.floor(this.__playduration / 1000)
			)}) - Encountered error: ${e}`
		);
	}

	/**
	 * Connect to voice channel
	 *
	 * @private
	 * @memberof MusicPlayer
	 */
	private __connect(): void {
		// create a voice connection
		this.__connection = Voice.joinVoiceChannel({
			channelId: this.__vchannel.id,
			guildId: this.__guild.id,
			adapterCreator: this.__vchannel.guild.voiceAdapterCreator,
		});

		// subscribe player to connection
		this.__connection.subscribe(this.__player);
		this.__connection.on("stateChange", this.__connectionStateChange.bind(this));
	}

	// ================================== Editable parts ==================================

	/**
	 * Get the guild this player belongs to
	 *
	 * @return {*}  {Discord.Guild}
	 * @memberof MusicPlayer
	 */
	public getGuild = (): Discord.Guild => this.__guild;

	/**
	 * Get all tracks in current player
	 *
	 * @return {*}  {MusicTrack[]}
	 * @memberof MusicPlayer
	 */
	public getQueue = (): MusicTrack[] => this.__queue;

	/**
	 * Add a track to current player
	 *
	 * @param {MusicTrack | MusicTrack[]} track
	 * @memberof MusicPlayer
	 */
	public addTrack = (track: MusicTrack | MusicTrack[]): any =>
		Array.isArray(track) ? track.forEach((tk) => this.__queue.push(tk)) : this.__queue.push(track);

	/**
	 * Remove a track from current player
	 * by a track instance, by name or by player's queue index
	 *
	 * @param {(MusicTrack | string | number)} input
	 * @return {*}  {MusicTrack}
	 * @memberof MusicPlayer
	 */
	public removeTrack(input: MusicTrack | string | number): MusicTrack {
		const search =
			input instanceof MusicTrack
				? this.__queue.find((track) => track === input)
				: typeof input === "string"
				? this.__queue.find((track) => track.name.includes(input.toLowerCase()))
				: this.__queue.at(input);
		if (!search) return undefined;
		return this.__queue.splice(this.__queue.indexOf(search), 1).shift();
	}

	/**
	 * Start/Play the player
	 *
	 * @return {*}  {MusicPlayer}
	 * @memberof MusicPlayer
	 */
	public play(): MusicPlayer {
		this.__player.play(
			// create an audio resource
			(this.current ||= Voice.createAudioResource(
				ytdl(this.__queue.at(0).url, {
					filter: "audioonly",
					quality: "highestaudio",
					highWaterMark: 1 << 24,
					begin: this.__playduration,
				}),
				{
					inputType: Voice.StreamType.WebmOpus,
					metadata: this.__queue.at(0),
				}
			))
		);
		return this;
	}

	/**
	 * Skip current playing track
	 *
	 * @memberof MusicPlayer
	 */
	public skip(): void {
		// only trigger if queue is longer than 1
		if (this.__queue.length > 1) {
			this.current = null;
			this.__player.stop();
		}
	}

	/**
	 * (Un)pause the player
	 *
	 * @memberof MusicPlayer whether the player is paused or not
	 */
	public togglePauseResume(): void {
		this.isPlaying()
			? (this.__player.pause(), this.__tchannel.send(MusicPlayerLang.PLAYER_PAUSED))
			: (this.__player.unpause(), this.__tchannel.send(MusicPlayerLang.PLAYER_RESUMED));
	}

	/**
	 * Check if player is playing
	 *
	 * @memberof MusicPlayer
	 */
	public isPlaying = () => (this.__player?.state.status || false) === Voice.AudioPlayerStatus.Playing;

	/**
	 * Disconnect and destroy the player
	 *
	 * @memberof MusicPlayer
	 */
	public disconnect(): void {
		try {
			this.__reconnectAttempts += 69;
			this.__connection.destroy();
		} catch {
			this.__tchannel.send(MusicPlayerLang.PLAYER_ADY_DESTROYED);
		}
	}
}
