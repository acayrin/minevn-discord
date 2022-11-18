import Eris from "eris";

declare module "eris" {
	export interface GuildEmoji {
		getIdentifier: () => string;
		toString: () => string;
		id: string;
		name: string;
		animated: boolean;
		available: boolean;
		managed: boolean;
		require_colons: boolean;
		roles: string[];
	}
	export class GuildEmoji implements Eris.Emoji, Eris.GuildEmoji {
		constructor(o: Eris.Emoji);
	}
}

Eris.GuildEmoji = class {
	id: string;
	name: string;
	animated: boolean;
	available: boolean;
	managed: boolean;
	require_colons: boolean;
	roles: string[];

	constructor(o: Eris.Emoji) {
		this.id = o.id;
		this.name = o.name;
		this.animated = o.animated;
		this.available = o.available;
		this.managed = o.managed;
		this.require_colons = o.require_colons;
		this.roles = o.roles;
	}

	getIdentifier() {
		return `${this.animated ? "a" : ""}:${this.name}:${this.id}`;
	}

	toString() {
		return `<${this.getIdentifier()}>`;
	}
};
