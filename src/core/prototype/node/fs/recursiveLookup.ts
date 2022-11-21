/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

declare module 'fs' {
	/**
	 * Lookup a directory recursively and execute callback on found files
	 * @param path Path to lookup
	 * @param callback Callback function to execute per entry found
	 */
	export function recursiveLookup(path: string, callback: (opt: string) => unknown): void;
	/**
	 * Lookup a directory recursively and list all items
	 * @param path Path to lookup
	 */
	export function recursiveList(path: string): string[];
}
fs.recursiveLookup = (path, callback) => {
	fs.readdirSync(path).forEach((name) => {
		if (fs.statSync(`${path}/${name}`).isDirectory()) {
			fs.recursiveLookup(`${path}/${name}`, callback);
		} else {
			callback(`${path}/${name}`);
		}
	});
};

fs.recursiveList = (path) => {
	let list: string[] = [];

	fs.readdirSync(path).forEach((name) => {
		if (fs.statSync(`${path}/${name}`).isDirectory()) {
			list = list.concat(fs.recursiveList(`${path}/${name}`));
		} else {
			list.push(`${path}/${name}`);
		}
	});

	return list;
};
