const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args, dbUser) => {

    if (!dbUser) return message.channel.send("**Tu ne peux pas faire cette commande tant que tu n'as pas de fiche Roleplay !**");
    if (!dbUser.income) return message.channel.send("**Tu as déjà utilisé cette commande aujourd'hui !**");

    
    const incomeList = require("../../assets/salaire/salaire.json");
    let income = 0;

    if (incomeList.length < 0) message.channel.send("**Tu n'as aucun salaire à récolter !**");


    for (const thisIncome in incomeList) {
        if (message.member.roles.cache.has(incomeList[thisIncome].role)) income += parseInt(incomeList[thisIncome].montant);
    }

        await client.addBalance(message.member, income);
        await client.updateUser(message.member, { income: "false" });
        await client.reloadStatus(message.author);

        const status_logs_embed = new MessageEmbed()
            .setDescription(`**Le status de ${message.author} a été actualisé !**`)
            .setColor("#26D6FF");
        client.channels.cache.get(client.serverSettings.statusLogsChannelId).send({ embeds: [status_logs_embed] });

        message.channel.send(`Tu viens de recevoir ton salaire de **${income} Berrys** !`)

}

module.exports.help = MESSAGES.COMMANDS.ECONOMY.COLLECT_INCOME;