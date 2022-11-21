import Eris from 'eris';

declare module 'eris' {
	/**
	 * An interaction builder, since eris has none
	 */
	export interface InteractionBuilder {
		addButton: (o?: {
			label: string;
			style?: 1 | 2 | 3 | 4;
			custom_id?: string | number;
			emoji?: string;
		}) => Eris.InteractionBuilder;
		prependButton: (o?: {
			label: string;
			style?: 1 | 2 | 3 | 4;
			custom_id?: string | number;
			emoji?: string;
		}) => Eris.InteractionBuilder;
		addSelectMenu: (o?: {
			placeholder?: string;
			min_values?: number;
			max_values?: number;
			custom_id?: string;
			options?: {
				label: string;
				value: string;
				description?: string;
				emoji?: Eris.Emoji;
				default?: boolean;
			}[];
		}) => Eris.InteractionBuilder;
		prependSelectMenu: (o?: {
			placeholder?: string;
			min_values?: number;
			max_values?: number;
			custom_id?: string;
			options?: {
				label: string;
				value: string;
				description?: string;
				emoji?: Eris.Emoji;
				default?: boolean;
			}[];
		}) => Eris.InteractionBuilder;
		addRow: () => Eris.InteractionBuilder;
		prependRow: () => Eris.InteractionBuilder;
		selectRow: (index: number) => Eris.InteractionBuilder;
		removeRow: (index?: number) => Eris.InteractionBuilder;
		removeComponent: (index: number) => Eris.InteractionBuilder;
		toComponent: () => Eris.ActionRow[];
	}
	/**
	 * An interaction builder, since eris has none
	 */
	export class InteractionBuilder {}
	export enum ButtonColor {
		blurple = 1,
		gray = 2,
		green = 3,
		red = 4,
	}
}

Eris.InteractionBuilder = class {
	#rows: Eris.ActionRow[] = [];
	#current_row = 0;

	constructor() {
		// nothing
	}

	addSelectMenu(o?: {
		placeholder?: string;
		min_values?: number;
		max_values?: number;
		custom_id?: string;
		options?: {
			label: string;
			value: string;
			description?: string;
			emoji?: Eris.Emoji;
			default?: boolean;
		}[];
	}) {
		// update
		this.#current_row =
			this.#rows.push({
				type: 1,
				components: [
					{
						type: 3,
						placeholder: o.placeholder,
						custom_id: o.custom_id,
						options: o.options,
						min_values: o.min_values,
						max_values: o.max_values,
					},
				],
			}) - 1;

		return this;
	}

	prependSelectMenu(o?: {
		placeholder?: string;
		min_values?: number;
		max_values?: number;
		custom_id?: string;
		options?: {
			label: string;
			value: string;
			description?: string;
			emoji?: Eris.Emoji;
			default?: boolean;
		}[];
	}) {
		// update
		this.#current_row = 0;
		this.#rows.unshift({
			type: 1,
			components: [
				{
					type: 3,
					placeholder: o.placeholder,
					custom_id: o.custom_id,
					options: o.options,
					min_values: o.min_values,
					max_values: o.max_values,
				},
			],
		});

		return this;
	}

	addButton(o?: {
		label: string;
		style?: Eris.ButtonColor;
		custom_id?: string | number;
		emoji?: string;
	}): Eris.InteractionBuilder {
		if (this.#rows.length === 0) {
			this.addRow();
		}

		this.#rows.at(this.#current_row).components.push({
			type: 2,
			label: o.label,
			style: o.style || 2,
			custom_id: `${o.custom_id}` || `${Date.now()}`,
			emoji: o.emoji ? { name: o.emoji } : null,
		});

		return this;
	}

	prependButton(o?: {
		label: string;
		style?: Eris.ButtonColor;
		custom_id?: string | number;
		emoji?: string;
	}): Eris.InteractionBuilder {
		if (this.#rows.length === 0) {
			this.addRow();
		}

		this.#rows.at(this.#current_row).components.push({
			type: 2,
			label: o.label,
			style: o.style || 2,
			custom_id: `${o.custom_id}` || `${Date.now()}`,
			emoji: o.emoji ? { name: o.emoji } : null,
		});

		return this;
	}

	addRow(): Eris.InteractionBuilder {
		this.#current_row =
			this.#rows.push({
				components: [],
				type: 1,
			}) - 1;

		return this;
	}

	prependRow(): Eris.InteractionBuilder {
		this.#rows.unshift({
			components: [],
			type: 1,
		});
		this.#current_row = 0;

		return this;
	}

	removeComponent(index: number): Eris.InteractionBuilder {
		this.#rows.at(this.#current_row).components.splice(index, 1);

		return this;
	}

	selectRow(index = 0): Eris.InteractionBuilder {
		this.#current_row = index < 0 || index >= this.#rows.length ? 0 : index;

		return this;
	}

	removeRow(index?: number): Eris.InteractionBuilder {
		this.#rows.splice(index || this.#current_row, 1);

		return this;
	}

	toComponent(): Eris.ActionRow[] {
		return this.#rows;
	}
};
