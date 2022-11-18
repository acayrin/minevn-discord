import { BasePage } from '../../base/Base';
import { Dice } from '../../enum/Dice';

export const card: BasePage = {
	name: 'Basic evade',
	description: 'A basic evade move',
	cost: 1,
	dices: [
		{
			type: Dice.Evade,
			value: {
				min: 3,
				max: 18,
			},
		},
	],
};
