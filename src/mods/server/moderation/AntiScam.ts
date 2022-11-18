import Yujin from '../../../core/yujin';

export default class extends Yujin.Mod {
	constructor() {
		super({
			name: 'Anti Scam',
			group: 'Server',
			author: 'acayrin',
			intents: ['guilds', 'guildMessages'],
			description: 'Remove all* messages that are possibly scam',
			priority: 9999,
			events: {
				onInit: async () => {
					if (!this.getConfig())
						this.generateDefaultConfig({
							punishment: 'timeout',
							timeout_duration: 180,
							send_direct_message: true,
						});
				},
				onMsgCreate: async (msg): Promise<unknown> => {
					const check = {
						content:
							msg.content.toLowerCase().includes('steam') &&
							msg.content.toLowerCase().includes('free') &&
							msg.content.toLowerCase().includes('nitro') &&
							msg.mentionEveryone,
						embed:
							msg.embeds?.length > 0 &&
							msg.embeds.some((embed) => embed.title?.match(/free/gi)) &&
							msg.embeds.some((embed) => embed.title?.match(/steam/gi)) &&
							msg.embeds.some((embed) => embed.title?.match(/nitro/gi)) &&
							msg.mentionEveryone,
					};

					if (check.content || check.embed) {
						if (this.getConfig().punishment.toLowerCase() === 'kick')
							await msg
								.guild()
								.kickMember(msg.author.id, 'Automated punishment for posting fake giveaway websites');
						else if (this.getConfig().punishment.toLowerCase() === 'ban')
							await msg
								.guild()
								.banMember(
									msg.author.id,
									0,
									'Automated pusnishment for posting fake giveaway websites',
								);
						else
							await msg.member.edit({
								communicationDisabledUntil: new Date(
									Date.now() * this.getConfig().timeout_duration * 60e3,
								),
							});

						if (this.getConfig().send_direct_message)
							(await msg.author.getDMChannel()).createMessage(
								[
									`You've been punished in **${
										msg.guild().name
									}** due to posting fake giveaway websites.`,
									`Possibly that your account had been token logged.`,
									`It is recommended to change your password and active 2-factor authentication.`,
									`If you think you were punished by mistake, please contact the server moderators.`,
								].join('\n'),
							);

						return msg.delete().finally(() => {
							msg.reply(
								`${msg.author.mention} **YOU'RE FORBIDDEN FROM POSTING FAKE GIVEAWAY WEBSITES!**`,
							);
						});
					}
				},
			},
		});
	}
}
