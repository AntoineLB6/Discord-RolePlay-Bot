const { MessageActionRow, MessageButton } = require("discord.js");
const { MESSAGES } = require("../../util/constants");

module.exports.run = async (client, message, args, dbUser, dbGuild) => {

    const itemsList = dbGuild.shop;
    let pageNumber = 1;
    const maxPage = await Math.ceil(itemsList.length / 10);
    let info_embed = await client.getShop(pageNumber, message.author);

    const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('previous')
                .setEmoji('◀️')
                .setLabel('Page Précédente')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('next')
                .setEmoji('▶️')
                .setLabel('Page Suivante')
                .setStyle('PRIMARY'),
        );

    if (maxPage === 1) {
        for (component in row.components) {
            row.components[component].disabled = true;
        }
    }

    const IpMessage = await message.channel.send({ embeds: [info_embed], components: [row] });

    const interactionfilter = i => {
        return i.user.id === message.author.id;
    };
    const collector = await IpMessage.createMessageComponentCollector({
        filter: interactionfilter,
        time: 300000,
    });

    collector.on("collect", async (i) => {
        await i.deferUpdate();
        switch (i.customId) {
            case "previous": {
                if (pageNumber <= 1) pageNumber = maxPage;
                else pageNumber -= 1;
                let info_embed = await client.getShop(pageNumber, message.author);
                if (maxPage === 1) {
                    for (component in row.components) {
                        row.components[component].disabled = true;
                    }
                }
                i.editReply({ embeds: [info_embed], components: [row] });
                break;
            }
            case "next": {
                if (pageNumber >= maxPage) pageNumber = 1;
                else pageNumber += 1;
                let info_embed = await client.getShop(pageNumber, message.author);
                if (maxPage === 1) {
                    for (component in row.components) {
                        row.components[component].disabled = true;
                    }
                }
                i.editReply({ embeds: [info_embed], components: [row] });
                break;
            }
        }
        await collector.resetTimer();
    });
}

module.exports.help = MESSAGES.COMMANDS.ECONOMY.SHOP;
