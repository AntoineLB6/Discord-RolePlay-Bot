const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const categoryList = readdirSync("./commands");
const { MESSAGES } = require("../../util/constants");

module.exports.run = (client, message, args) => {
    if (!args.length) {
        const embed = new MessageEmbed()

            .setColor("#33FF89")
            .addField(
                "Liste des Commandes :",
                `Liste répertoriant toutes les sous-catégories et leurs commandes.\nPour plus d'information sur une commande en particulier, tapez \`${client.serverSettings.prefix}help <Nom_Commande>\`.`
            );

        for (const category of categoryList) {
            embed.addField(
                `${category}`,
                `${client.commands
                    .filter(cat => cat.help.category === category.toLowerCase())
                    .map(cmd => cmd.help.name)
                    .join(", ")}`
            );
        }

        return message.channel.send({ embeds: [embed] });
    }
    const command =
      client.commands.get(args[0]) ||
      client.commands.find(
          cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0])
      );
    if (!command) return message.channel.send("cette commande n'existe pas.");

    const embed = new MessageEmbed()

        .setColor("#33FF89")
        .setTitle(`**${command.help.name}**`)
        .addField("Description:", `${command.help.description}`)
        .addField(
            "Cooldown:",
            command.help.cooldown
                ? `${command.help.cooldown} secondes`
                : "Aucun Cooldown",
            true
        )
        .addField(
            "Utilisation:",
            command.help.usage
                ? `${client.serverSettings.prefix}${command.help.name} ${command.help.usage}`
                : `${client.serverSettings.prefix}${command.help.name}`,
            true
        );
    if (command.help.aliases.length > 1)
        embed.addField("Aliases:", `${command.help.aliases.join(", ")}`, true);
    return message.channel.send({ embeds: [embed] });
};

module.exports.help = MESSAGES.COMMANDS.MISC.HELP;
