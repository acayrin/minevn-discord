import crypto from 'crypto';

/**
 * Generate an ID
 */
export function id(): string {
	return crypto.createHash('sha256').update(Date.now().toString(), 'utf8').digest('hex').slice(0, 7);
}
