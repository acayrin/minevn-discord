import { Dice } from '../enum/Dice';

export interface BasePage {
	name: string;
	description: string;
	cost: number;
	dices: {
		type: Dice;
		value: {
			min: number;
			max: number;
		};
	}[];
}

export interface BaseKey {
	name: string;
	description: string;
	hp: number;
	stagger: number;
}
