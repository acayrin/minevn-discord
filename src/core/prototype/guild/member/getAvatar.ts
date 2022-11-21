import Eris from 'eris';

declare module 'eris' {
	interface Member {
		/**
		 * Get a member's avatar
		 * @param type Image encode type
		 * @returns Static URL of the avatar
		 */
		getAvatar: (type?: 'webp' | 'png' | 'jpg') => string;
	}
}

// guild member
Eris.Member.prototype.getAvatar = function (this: Eris.Member, type?: 'webp' | 'png' | 'jpg') {
	let ava = this.avatarURL.slice(0, -10);
	ava = ava.endsWith('.webp') ? ava.slice(0, -5) : ava.slice(0, -4);

	return (
		(type === 'webp'
			? `${ava}.webp`
			: type === 'png'
			? `${ava}.png`
			: type === 'jpg'
			? `${ava}.jpg`
			: `${ava}.webp`) + '?size=1024'
	);
};
