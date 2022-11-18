import crypto from 'crypto';

/**
 * Generate an ID
 *
 * @export
 * @return {*}  {string}
 */
export function id(): string {
  return crypto.createHash('md5').update(Date.now().toString(), 'utf8').digest('hex').slice(0, 7);
}
