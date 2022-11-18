import { BasePage } from '../../base/Base';
import { Dice } from '../../enum/Dice';

export const card: BasePage = {
	name: 'Basic attack',
	description: 'A basic attack move',
	cost: 1,
	dices: [
		{
			type: Dice.Attack,
			value: {
				min: 5,
				max: 15,
			},
		},
	],
};
