import Eris from 'eris';

/**
 * [Snipe Mod] Discord chat record
 *
 * @export
 * @interface SnipeChatRecord
 */
export type SnipeChatRecord = {
	id: string;
	content: string;
	files: any; // MessageAttachment | BufferResolvable | FileOptions
	owner: string;
	avatar: string;
	timestamp: number;
	embeds: Eris.Embed[];
};
