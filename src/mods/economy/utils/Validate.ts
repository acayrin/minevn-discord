import Eris from 'eris';
import Yujin from '../../../core/yujin';

export async function validate(data: {
	message: Eris.Message;
	database: Yujin.Datastore;
	currency: Eris.GuildEmoji;
	input: string;
	amount: number;
	min: number;
	max: number;
	player_1: Eris.User;
	player_2: Eris.User;
}) {
	// invalid amount
	if (Number.isNaN(data.amount)) {
		await data.message.reply(`**${data.input}** isn't a valid number, please try again`);
		return false;
	}
	// insuffcient amount 1
	if (data.database.get(data.player_1.id) < data.amount) {
		await data.message.reply(
			`You don't have enough **__${data.amount.toLocaleString()}__** ${data.currency.toString()} to play`,
		);
		return false;
	}
	// insuffcient amount 2
	if (data.player_2 && !data.player_2.bot && data.database.get(data.player_2.id) < data.amount) {
		await data.message.reply(
			`**${data.player_2.tag()}** doesn't have enough **__${data.amount.toLocaleString()}__** ${data.currency.toString()} to play`,
		);
		return false;
	}
	// less than minimum allowed 1
	if (Number.parseFloat(data.amount.toString()) < data.min) {
		await data.message.reply(
			`You don't have minimum **__${data.min.toLocaleString()}__** ${data.currency.toString()} to play`,
		);
		return false;
	}
	// over maximum allowed
	if (Number.parseFloat(data.amount.toString()) > data.max) {
		data.amount = data.max;
	}

	return data;
}
