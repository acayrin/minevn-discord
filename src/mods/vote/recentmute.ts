// store recently muted users
const recentmutes: string[] = [];

/**
 * Add a user to the recently muted list
 *
 * @param {string} user
 */
function add(user: string) {
	recentmutes.push(user);
}

/**
 * Remove a user from the recently muted list
 *
 * @param {string} user
 */
function remove(user: string) {
	recentmutes.splice(recentmutes.indexOf(user), 1);
}

/**
 * Check if a user was recently muted
 *
 * @param {string} user
 * @return {*}
 */
function has(user: string): boolean {
	return recentmutes.find((mute) => mute.includes(user)) ? true : false;
}

export { add, remove, has };
