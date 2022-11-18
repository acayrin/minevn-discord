import { BasePage } from '../../base/Base';
import { Dice } from '../../enum/Dice';

export const card: BasePage = {
	name: 'Basic defend',
	description: 'A basic defend move',
	cost: 1,
	dices: [
		{
			type: Dice.Defend,
			value: {
				min: 8,
				max: 12,
			},
		},
	],
};
