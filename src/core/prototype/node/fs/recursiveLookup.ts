/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

declare module 'fs' {
	/**
	 * @description Lookup a directory recursively and execute callback on found files
	 * @author acayrin
	 * @export
	 * @param {string} path
	 * @param {(...opt: any) => any} callback
	 */
	export function recursiveLookup(path: string, callback: (...opt: any[]) => any): void;
	/**
	 * @description Lookup a directory recursively and list all items
	 * @author acayrin
	 * @export
	 * @param {string} path
	 * @param {(...opt: any) => any} callback
	 * @return {string[]}
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
