import * as Discord from "discord.js";
import { SucklessBot } from "../../core/class/sucklessbot";

/**
 * Send help page to user
 *
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {SucklessBot} bot
 */
const getHelp = (
    message: Discord.Message,
    args: string[],
    bot: SucklessBot
) => {
    if (args && args[0]) {
        // get the mod associated with the command
        const mod = bot.cmdMgr.getMod(args[0]);
        if (!mod) return;

        // send the help page
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor("#ed2261")
                    .setTimestamp()
                    .setThumbnail(bot.cli().user.avatarURL())
                    .setTitle(`[Mod] ${mod.name}`)
                    .setDescription(
                        `${
                            mod.description ||
                            "*This mod doesn't have any description*"
                        }`
                    )
                    .addField(
                        `Command: \`\` ${bot.cmdMgr
                            .getCommands(mod)
                            .join(", ")} \`\``,
                        `Aliases: \`\` ${bot.cmdMgr
                            .getAliases(mod)
                            .join(", ")} \`\``
                    )
                    .addField(
                        "Usage",
                        `${mod.usage.replace(/%prefix%+/, bot.config.prefix)}`
                    )
                    .setFooter(mod.author ? `by ${mod.author}` : undefined),
            ],
        });

        // if no command was specified, use the default one
    } else if (args) {
        const mods: string[] = [];
        bot.mods.forEach((mod) => mods.push(mod.name));

        // send the help page
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setColor("#ed2261")
                    .setTimestamp()
                    .setThumbnail(bot.cli().user.avatarURL())
                    .setTitle(`Guide on How to use this thing`)
                    .setDescription(
                        `A some-what useful guide on how to use this thing, idk`
                    )
                    .addField("Loaded mods", `${mods.join(", ")}`)
                    .addField(
                        "Availabe commands",
                        `${bot.cmdMgr.commands.join(", ")}`
                    )
                    .addField(
                        "\u200B",
                        `for command specific help, use \`\` ${bot.config.prefix} help <command> \`\``
                    ),
            ],
        });
    }
};

export { getHelp };
