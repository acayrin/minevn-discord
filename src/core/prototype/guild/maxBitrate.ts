import Eris from 'eris';

declare module 'eris' {
	export interface Guild {
		/**
		 * Get guild's maximum bitrate
		 * @returns Guild bitrate
		 */
		maxBitrate: () => number;
	}
}

Eris.Guild.prototype.maxBitrate = function (this: Eris.Guild): number {
	return this.premiumTier?.valueOf() === 1 // boost 1
		? 128
		: this.premiumTier?.valueOf() === 2 // boost 2
		? 256
		: this.premiumTier?.valueOf() === 3 // boost 3
		? 384
		: 96;
};
