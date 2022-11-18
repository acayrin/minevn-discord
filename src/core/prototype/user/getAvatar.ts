import Eris from 'eris';

declare module 'eris' {
	interface User {
		/**
		 * @description Get a user's avatar
		 * @author acayrin
		 * @memberof User
		 */
		getAvatar: (type?: 'webp' | 'png' | 'jpg') => string;
	}
}

Eris.User.prototype.getAvatar = function (this: Eris.User, type?: 'webp' | 'png' | 'jpg') {
	let ava = this.avatarURL.slice(0, -10);
	if (ava.endsWith('.webp')) ava = ava.slice(0, -5);
	else ava = ava.slice(0, -4);
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
