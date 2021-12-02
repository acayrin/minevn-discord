/**
 * [Snipe Mod] Discord chat record
 *
 * @export
 * @interface DSChatRecord
 */
export interface DSChatRecord {
    /**
     * Message id
     *
     * @type {string}
     * @memberof DSChatRecord
     */
    id: string,

    /**
     * Message content
     *
     * @type {string}
     * @memberof DSChatRecord
     */
    content: string,

    /**
     * Message attachments
     *
     * @type {*}
     * @memberof DSChatRecord
     */
    files: any,   // MessageAttachment | BufferResolvable | FileOptions

    /**
     * Message author
     *
     * @type {string}
     * @memberof DSChatRecord
     */
    owner: string,
    
    /**
     * Message author's avatar
     *
     * @type {string}
     * @memberof DSChatRecord
     */
    avatar: string,
}