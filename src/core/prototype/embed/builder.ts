import Eris from 'eris';

declare module 'eris' {
	export interface Embed {
		setTitle: (title: string) => Eris.Embed;
		setColor: (color: string) => Eris.Embed;
		setDescription: (description: string) => Eris.Embed;
		setImage: (url: string) => Eris.Embed;
		setAuthor: (name: string, url?: string, icon_url?: string) => Eris.Embed;
		addField: (name: string, value: string, inline?: boolean) => Eris.Embed;
		addFields: (...opt: { name: string; value: string; inline?: boolean }[]) => Eris.Embed;
		prependField: (name: string, value: string, inline?: boolean) => Eris.Embed;
		prependFields: (...opt: { name: string; value: string; inline?: boolean }[]) => Eris.Embed;
		clearField: (index: number, count?: number) => Eris.Embed;
		clearFields: () => Eris.Embed;
		setTimestamp: (date?: number | Date) => Eris.Embed;
		setFooter: (text: string, icon_url?: string) => Eris.Embed;
		setUrl: (url: string) => Eris.Embed;
		setThumbnail: (url: string) => Eris.Embed;
	}

	/**
	 * Create aa message embed object
	 */
	export class Embed implements Eris.EmbedOptions, Eris.Embed {}
}

Eris.Embed = class {
	type: string;
	title?: string;
	timestamp?: string | Date;
	thumbnail?: Eris.EmbedImageOptions;
	author?: Eris.EmbedAuthorOptions;
	description?: string;
	color?: number;
	image?: Eris.EmbedImageOptions;
	fields?: Eris.EmbedField[];
	footer?: Eris.EmbedFooterOptions;
	url?: string;

	constructor() {
		this.type = 'fancy';
	}
	setTitle(title: string): Eris.Embed {
		this.title = title;
		return this;
	}

	setColor(color: string): Eris.Embed {
		this.color = parseInt(color.replace(/#/g, '').toString(), 16);
		return this;
	}

	setDescription(description: string): Eris.Embed {
		this.description = description;
		return this;
	}

	setImage(url: string): Eris.Embed {
		this.image = {
			url,
		};
		return this;
	}

	setAuthor(name: string, url?: string, icon_url?: string): Eris.Embed {
		this.author = {
			name,
			url,
			icon_url,
		};
		return this;
	}

	addField(name: string, value: string, inline?: boolean): Eris.Embed {
		if (!this.fields) this.fields = [];

		this.fields.push({
			name,
			value,
			inline: inline || false,
		});

		return this;
	}

	addFields(...opt: { name: string; value: string; inline?: boolean }[]): Eris.Embed {
		if (!this.fields) this.fields = [];

		for (const o of opt) {
			this.fields.push({
				name: o.name,
				value: o.value,
				inline: o.inline || false,
			});
		}

		return this;
	}

	prependField(name: string, value: string, inline?: boolean): Eris.Embed {
		if (!this.fields) this.fields = [];

		this.fields.unshift({
			name,
			value,
			inline: inline || false,
		});

		return this;
	}

	prependFields(...opt: { name: string; value: string; inline?: boolean }[]): Eris.Embed {
		if (!this.fields) this.fields = [];

		for (const o of opt) {
			this.fields.unshift({
				name: o.name,
				value: o.value,
				inline: o.inline || false,
			});
		}

		return this;
	}

	clearField(index: number, count = 1): Eris.Embed {
		this.fields.splice(index, count);

		return this;
	}

	clearFields(): Eris.Embed {
		this.fields = [];

		return this;
	}

	setTimestamp(date?: number | Date): Eris.Embed {
		this.timestamp =
			!date || date instanceof Date ? new Date().toISOString() : new Date(Number(date)).toISOString();

		return this;
	}

	setFooter(text: string, icon_url?: string): Eris.Embed {
		this.footer = {
			text,
			icon_url,
		};

		return this;
	}

	setUrl(url: string): Eris.Embed {
		this.url = url;

		return this;
	}

	setThumbnail(url: string): Eris.Embed {
		this.thumbnail = {
			url,
		};

		return this;
	}
};
