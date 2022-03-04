/**
 * [Snipe Mod] Discord chat record
 *
 * @export
 * @interface SnipeChatRecord
 */
export interface SnipeChatRecord {
	/**
	 * Message id
	 *
	 * @type {string}
	 * @memberof SnipeChatRecord
	 */
	id: string;

	/**
	 * Message content
	 *
	 * @type {string}
	 * @memberof SnipeChatRecord
	 */
	content: string;

	/**
	 * Message attachments
	 *
	 * @type {*}
	 * @memberof SnipeChatRecord
	 */
	files: any; // MessageAttachment | BufferResolvable | FileOptions

	/**
	 * Message author
	 *
	 * @type {string}
	 * @memberof SnipeChatRecord
	 */
	owner: string;

	/**
	 * Message author's avatar
	 *
	 * @type {string}
	 * @memberof SnipeChatRecord
	 */
	avatar: string;

	/**
	 * Message timestamp
	 *
	 * @type {number}
	 * @memberof SnipeChatRecord
	 */
	timestamp: number;
}
