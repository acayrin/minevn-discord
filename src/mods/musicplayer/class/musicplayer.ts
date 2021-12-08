import * as Voice from "@discordjs/voice";
import * as crypto from "crypto";
import * as Discord from "discord.js";
import { MusicManager } from "./musicmanager";
import { MusicTrack } from "./musictrack";
import ytdl = require("ytdl-core");
import { MusicPlayerLang } from "../lang";
import { SucklessBot } from "../../../core/sucklessbot";

export class MusicPlayer {
	public readonly id: string = crypto
		.createHash("md5")
		.update(Date.now().toString(), "utf-8")
		.digest("hex")
		.slice(0, 7);
	public current: Voice.AudioResource<MusicTrack>;

	private __queue: MusicTrack[] = [];
	private __guild: Discord.Guild;
	private __tchannel: Discord.TextChannel;
	private __vchannel: Discord.VoiceChannel | Discord.StageChannel;
	private __connection: Voice.VoiceConnection;
	private __player: Voice.AudioPlayer;
	private __manager: MusicManager;
	private __bot: SucklessBot;

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

		/**
		 *
		 * Join and create the voice connection
		 *
		 */
		this.__connection = Voice.joinVoiceChannel({
			channelId: this.__vchannel.id,
			guildId: this.__guild.id,
			adapterCreator: this.__vchannel.guild.voiceAdapterCreator,
		});
		this.__connection.subscribe(this.__player);

		/**
		 *
		 * Handle when the voice state changes
		 *
		 */
		this.__connection.on("stateChange", async (_, newState: Voice.VoiceConnectionState) => {
			if (this.__bot.debug)
				this.__connection.on("debug", (m) => this.__bot.logger.debug(`[MusicPlayer - ${this.id}] ${m}`));
			if (newState.status === Voice.VoiceConnectionStatus.Disconnected) {
				if (
					newState.reason === Voice.VoiceConnectionDisconnectReason.WebSocketClose &&
					newState.closeCode === 4014
				) {
					try {
						await Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Connecting, 20e3);
					} catch (e) {
						this.__connection.destroy();
						if (this.__bot.debug)
							this.__bot.logger.debug(`[MusicPlayer - ${this.id}] CONN - Encountered error: ${e}`);
					}
				} else if (this.__connection.rejoinAttempts < 5) {
					if (this.__bot.debug)
						this.__bot.logger.debug(
							`[MusicPlayer - ${this.id}] CONN - Reconnecting attempt ${this.__connection.rejoinAttempts}`
						);
					await new Promise((r) => setTimeout(r, (this.__connection.rejoinAttempts + 1) * 3e3).unref());
					this.__connection.rejoin();
				} else {
					this.__connection.destroy();
				}
			} else if (
				newState.status === Voice.VoiceConnectionStatus.Connecting ||
				newState.status === Voice.VoiceConnectionStatus.Signalling
			) {
				try {
					await Voice.entersState(this.__connection, Voice.VoiceConnectionStatus.Ready, 20e3);
				} catch (e) {
					if (this.__bot.debug)
						this.__bot.logger.debug(`[MusicPlayer - ${this.id}] CONN - Encountered error: ${e}`);
					if (this.__connection.state.status !== Voice.VoiceConnectionStatus.Destroyed) {
						this.__connection.destroy();
					}
				}
			} else if (newState.status === Voice.VoiceConnectionStatus.Destroyed) {
				this.destroy();
			}
		});

		/**
		 *
		 * Handle when the player state changes
		 *
		 */
		this.__player.on("error", async (e) => {
			if (e.message.includes("410")) {
				this.__tchannel.send(MusicPlayerLang.ERR_TRACK_AGE_RESTRICTED);
			} else if (e.message.includes("403")) {
				this.__tchannel.send(MusicPlayerLang.ERR_TRACK_RATE_LIMITED);
				this.__queue.unshift(this.current.metadata);
			} else if (e.message.includes("EBML")) {
				this.__tchannel.send(MusicPlayerLang.ERR_TRACK_NO_OPUS);
			} else {
				this.__tchannel.send(MusicPlayerLang.ERR_TRACK_UNKNOWN.replace(/%error%+/g, e.message));
				this.__queue.unshift(this.current.metadata);
			}
			if (this.__bot.debug)
				this.__bot.logger.debug(
					`[MusicPlayer - ${this.id}] PLAYER - Track: ${this.current.metadata.url} - Encountered error: ${e}`
				);
		});
		this.__player.on("stateChange", (oldState, newState) => {
			if (
				oldState.status === Voice.AudioPlayerStatus.Playing &&
				newState.status === Voice.AudioPlayerStatus.Idle
			) {
				const bf = this.__queue.shift();
				const af = this.__queue.at(0);
				this.current = null;
				this.__tchannel
					.send(
						MusicPlayerLang.PLAYER_FINISHED.replace(/%track_name%+/g, bf.name).replace(
							/%track_requester%+/g,
							bf.author.user.tag
						)
					)
					.then(() => {
						if (af)
							this.__tchannel
								.send(
									MusicPlayerLang.PLAYER_STARTED.replace(/%track_name%+/g, af.name).replace(
										/%track_requester%+/g,
										af.author.user.tag
									)
								)
								.then(() => setTimeout(() => this.play(), 2e3));
					});
			}
		});
		if (this.__bot.debug)
			this.__player.on("debug", (m) => this.__bot.logger.debug(`[MusicPlayer - ${this.id}] ${m}`));
	}

	/**
	 * Get the guild this player belongs to
	 *
	 * @return {*}  {Discord.Guild}
	 * @memberof MusicPlayer
	 */
	public getGuild = (): Discord.Guild => this.__guild;

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
	 * Get all tracks in current player
	 *
	 * @return {*}  {MusicTrack[]}
	 * @memberof MusicPlayer
	 */
	public getQueue = (): MusicTrack[] => this.__queue;

	/**
	 * Start/Play the player
	 *
	 * @return {*}  {Promise<MusicPlayer>}
	 * @memberof MusicPlayer
	 */
	public async play(): Promise<MusicPlayer> {
		if (this.__queue.length === 0) return;
		try {
			this.__player.play(
				(this.current ||= Voice.createAudioResource(
					ytdl(this.__queue.at(0).url, {
						filter: "audioonly",
						quality: "highestaudio",
						highWaterMark: 1 << 32,
					}).on("error", (e) => {
						this.__tchannel.send(MusicPlayerLang.ERR_PLAYER_UNKNOWN.replace(/%error%+/g, e.message));
						this.play();
						if (this.__bot.debug)
							this.__bot.logger.debug(
								`[MusicPlayer - ${this.id}] PLAY - Track: ${this.current.metadata.url} - Encountered error: ${e}`
							);
					}),
					{
						inputType: Voice.StreamType.WebmOpus,
						metadata: this.__queue.at(0),
					}
				))
			);
		} catch (e) {
			this.__tchannel.send(MusicPlayerLang.ERR_PLAYER_UNKNOWN.replace(/%error%+/g, e.message));
			this.play();
			if (this.__bot.debug)
				this.__bot.logger.debug(
					`[MusicPlayer - ${this.id}] PLAY - Track: ${this.current.metadata.url} - Encountered error: ${e}`
				);
		}
		return this;
	}

	/**
	 * Skip current playing track
	 *
	 * @memberof MusicPlayer
	 */
	public skip(): void {
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
	 * Destroy this player instance
	 *
	 * @memberof MusicPlayer
	 */
	public destroy(): void {
		try {
			this.__connection.destroy();
		} catch {}
		this.__tchannel.send(MusicPlayerLang.PLAYER_DESTROYED);
		this.__manager.remove(this);
	}
}
