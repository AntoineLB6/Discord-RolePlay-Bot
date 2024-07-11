const { Collection } = require("discord.js");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    let dbUser = await client.getUser(message.member);
    let dbGuild = await client.getGuild();

    if (!message.content.startsWith(client.serverSettings.prefix)) return;

    const args = message.content.slice(client.serverSettings.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName)
        );
    if (!command) return;

    if (
        command.help.isUserStaff &&
        !message.member.roles.cache.has(client.serverSettings.staffRoleId)
    )
        return message.channel.send(
            "Cette commande est réservé à l'équipe du staff."
        );

        if (
            command.help.isUserRP &&
            !dbUser
        )
            return message.channel.send(
                "Cette commande est réservé aux joueurs RP."
            );

    if (
        command.help.ownerOnly &&
        message.member.id !== client.config.ownerID
    )
        return message.channel.send(
            `Cette commande est réservé à <@${client.config.ownerID}>.`
        );

    if (
        command.help.permissions &&
        !message.member.permissions.has(command.help.permissionsList)
    )
        return message.channel.send(
            `Tu n'as pas les permissions requises.\nPermissions requises : \`${command.help.permissionsList}\``
        );

    if (command.help.args && !args.length) {
        let noArgsReply = `**Tu as mal utilisé la commande, ${message.author}!**`;
        if (command.help.usage)
            noArgsReply += `\n*Voici comment utiliser la commande:* \`${client.config.prefix}${command.help.name} ${command.help.usage}\``;

        return message.channel.send(noArgsReply);
    }

    if (!client.cooldowns.has(command.help.name)) {
        client.cooldowns.set(command.help.name, new Collection());
    }

    const timeNow = Date.now();
    const tStamps = client.cooldowns.get(command.help.name);
    const cdAmount = (command.help.cooldown || 5) * 1000;

    if (tStamps.has(message.author.id)) {
        const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

        if (timeNow < cdExpirationTime) {
            const timeLeft = (cdExpirationTime - timeNow) / 1000;
            return message.channel.send(
                `Merci d'attendre ${timeLeft.toFixed(0)} seconde(s) avant de ré-utiliser la commande \`${command.help.name}\`.`
            );
        }
    }

    tStamps.set(message.author.id, timeNow);
    setTimeout(() => tStamps.delete(message.author.id), cdAmount);

    console.log(`${message.author.tag} a lancé la commande : ${commandName}`);
    command.run(client, message, args, dbUser, dbGuild);
};
