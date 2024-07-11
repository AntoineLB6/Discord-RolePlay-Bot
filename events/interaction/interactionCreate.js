const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = async (client, interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "No-Partenariat") {
      if (interaction.member.roles.cache.has(client.serverSettings.noPartenariatRoleId)) {
        interaction.member.roles.remove(client.serverSettings.noPartenariatRoleId);
        interaction.reply({
          content: `Tu viens de perdre le role : <@&${client.serverSettings.noPartenariatRoleId}>.`,
          ephemeral: true,
        });
      }
      else {
        interaction.member.roles.add(client.serverSettings.noPartenariatRoleId);
        interaction.reply({
          content: `Tu viens de gagner le role : <@&${client.serverSettings.noPartenariatRoleId}>.`,
          ephemeral: true,
        });
      }
    }
    if (interaction.customId === "Partenariat") {
      const dbGuild = await client.getGuild();
      const ticketList = dbGuild.ticketsPartenariat;
      const ticket = ticketList.find(c => c.ticketMember === interaction.member.id)
      if (ticket) return interaction.reply({
        content: `Tu as déjà un ticket en cours, tu ne peux pas créer plus d'un ticket. (Si c'est une erreur et que tu n'en as pas, contacte le staff par MP pour qu'ils règlent l'erreur.)`,
        ephemeral: true,
      });
      else {
      const ticketChannel = await interaction.guild.channels.create(`partenariat-${interaction.user.username}`, {
        parent: client.serverSettings.ticketsPartenariatCategoryId,
        type: "GUILD_TEXT",
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: interaction.member.id,
            allow: ["VIEW_CHANNEL"],
          },
          {
            id: client.serverSettings.staffRoleId,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      })

    const embed = new MessageEmbed()

    .setAuthor({ name: "Ticket" })
    .setDescription(
      "**Bienvenue dans votre ticket, merci de bien vouloir directement envoyé votre pub avec une formule de politesse.**")
    .setColor("#ffffff");

    const row = new MessageActionRow()
    .setComponents(
        new MessageButton()
                .setCustomId('Delete-Ticket-Partenariat')
                .setLabel('Fermer Le Ticket')
                .setStyle('DANGER')
                .setEmoji("🍭")
    );

    await ticketChannel.send({ content: `<@${interaction.member.id}>`, embeds: [embed], components: [row] })

    const data = {
      ticketMember: interaction.member.id,
      ticketId: ticketChannel.id
    }
      await ticketList.push(data);
      await client.updateGuild({ ticketsPartenariat: ticketList });
      interaction.reply({
        content: `Ton ticket a été créé avec succès : ${ticketChannel}`,
        ephemeral: true,
      });
    }
    }

    if (interaction.customId === "Delete-Ticket-Partenariat") {
      const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('oui')
                .setLabel('CONFIRMER')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('non')
                .setLabel('ANNULER')
                .setStyle('DANGER'),
        );

    const confirmation_embed = new MessageEmbed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        .setDescription(`**Voulez-vous vraiment fermer le ticket ?**`)
        .setColor("#FF0000");

    await interaction.reply({ content: `${interaction.user} tente de fermer le ticket.` })
    const msgToModify = await interaction.channel.send({ embeds: [confirmation_embed], components: [row] });
    try {
        const interactionfilter = i => i.user.id === interaction.user.id;
        let collectorValue = await msgToModify.awaitMessageComponent({ filter: interactionfilter, time: 120000, errors: ["time"] })
        if (collectorValue.customId === "non") return interaction.channel.send("**La commande a été annulée.**").then(msg => {
            setTimeout(() => {
              msg.delete()
              msgToModify.delete()
            }, 5000)
        })
        else {
          const dbGuild = await client.getGuild();
          const ticketList = dbGuild.ticketsPartenariat;
          const ticket = ticketList.find(c => c.ticketMember === interaction.member.id)
          const q = await ticketList.indexOf(ticket);
          await ticketList.splice(q, 1);
          await client.updateGuild({ ticketsPartenariat: ticketList });
          await interaction.channel.delete();
        }
    } catch (err) {
        msgToModify.delete();
        return interaction.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }
    }

    if (interaction.customId === "Support") {
      const dbGuild = await client.getGuild();
      const ticketList = dbGuild.ticketsSupport;
      const ticket = ticketList.find(c => c.ticketMember === interaction.member.id)
      if (ticket) return interaction.reply({
        content: `Tu as déjà un ticket en cours, tu ne peux pas créer plus d'un ticket. (Si c'est une erreur et que tu n'en as pas, contacte le staff par MP pour qu'ils règlent l'erreur.)`,
        ephemeral: true,
      });
      else {
      const ticketChannel = await interaction.guild.channels.create(`support-${interaction.user.username}`, {
        parent: client.serverSettings.ticketsSupportCategoryId,
        type: "GUILD_TEXT",
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: interaction.member.id,
            allow: ["VIEW_CHANNEL"],
          },
          {
            id: client.serverSettings.staffRoleId,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      })

    const embed = new MessageEmbed()

    .setAuthor({ name: "Ticket" })
    .setDescription(
      "**Bienvenue dans votre ticket, merci de bien vouloir nous expliquer le problème directement.**")
    .setColor("#ffffff");

    const row = new MessageActionRow()
    .setComponents(
        new MessageButton()
                .setCustomId('Delete-Ticket-Support')
                .setLabel('Fermer Le Ticket')
                .setStyle('DANGER')
                .setEmoji("🍭")
    );

    await ticketChannel.send({ content: `<@${interaction.member.id}>`, embeds: [embed], components: [row] })

    const data = {
      ticketMember: interaction.member.id,
      ticketId: ticketChannel.id
    }
      await ticketList.push(data);
      await client.updateGuild({ ticketsSupport: ticketList });
      interaction.reply({
        content: `Ton ticket a été créé avec succès : ${ticketChannel}`,
        ephemeral: true,
      });
    }
    }

    if (interaction.customId === "Delete-Ticket-Support") {
      const row = new MessageActionRow()
        .setComponents(
            new MessageButton()
                .setCustomId('oui')
                .setLabel('CONFIRMER')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('non')
                .setLabel('ANNULER')
                .setStyle('DANGER'),
        );

    const confirmation_embed = new MessageEmbed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        .setDescription(`**Voulez-vous vraiment fermer le ticket ?**`)
        .setColor("#FF0000");

    await interaction.reply({ content: `${interaction.user} tente de fermer le ticket.` })
    const msgToModify = await interaction.channel.send({ embeds: [confirmation_embed], components: [row] });
    try {
        const interactionfilter = i => i.user.id === interaction.user.id;
        let collectorValue = await msgToModify.awaitMessageComponent({ filter: interactionfilter, time: 120000, errors: ["time"] })
        if (collectorValue.customId === "non") return interaction.channel.send("**La commande a été annulée.**").then(msg => {
            setTimeout(() => {
              msg.delete()
              msgToModify.delete()
            }, 5000)
        })
        else {
          const dbGuild = await client.getGuild();
          const ticketList = dbGuild.ticketsSupport;
          const ticket = ticketList.find(c => c.ticketMember === interaction.member.id)
          const q = await ticketList.indexOf(ticket);
          await ticketList.splice(q, 1);
          await client.updateGuild({ ticketsSupport: ticketList });
          await interaction.channel.delete();
        }
    } catch (err) {
        msgToModify.delete();
        return interaction.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");
    }
    }
  }
  if (interaction.isSelectMenu()) {
    if (interaction.customId === "localisation") {
      let dbUser = await client.getUser(interaction.user);
      switch (interaction.values[0]) {
        case "Yelyra": {
          if (dbUser.status.localisation.localisationID) interaction.member.roles.remove(dbUser.status.localisation.localisationID);
          interaction.member.roles.add(client.serverSettings.yelyraLocalisationRoleId);
          await client.updateUser(interaction.user, { "status.localisation.localisationID": client.serverSettings.yelyraLocalisationRoleId })
          break;
        }
        case "Shaundyl": {
          if (dbUser.status.localisation.localisationID) interaction.member.roles.remove(dbUser.status.localisation.localisationID);
          interaction.member.roles.add(client.serverSettings.shaundylLocalisationRoleId);
          await client.updateUser(interaction.user, { "status.localisation.localisationID": client.serverSettings.shaundylLocalisationRoleId })
          break;
        }
        case "Necoqia": {
          if (dbUser.status.localisation.localisationID) interaction.member.roles.remove(dbUser.status.localisation.localisationID);
          interaction.member.roles.add(client.serverSettings.necoqiaLocalisationRoleId);
          await client.updateUser(interaction.user, { "status.localisation.localisationID": client.serverSettings.necoqiaLocalisationRoleId })
          break;
        }
      }
      await client.updateUser(interaction.user, { "status.localisation.localisation": interaction.values[0] })
      dbUser = await client.getUser(interaction.user);
      interaction.reply({
        content: `Ta localisation a été actualisé, tu es désormais localisé à : ${dbUser.status.localisation.localisation}.`,
        ephemeral: true,
      });
      const embed = new MessageEmbed()

        .setAuthor({ name: interaction.user.id, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`${interaction.user} a modifié sa localisation il est maintenant localisé à : **${dbUser.status.localisation.localisation})`)
        .setTimestamp()
        .setColor("#FF9610");

      client.channels.fetch(client.serverSettings.interactionLogsChannelId).then(c => c.send({ embeds: [embed] }));
    }

    if (interaction.customId === "select-menu") {
      const valuesArray = interaction.values;
      let addValues = [];
      let removeValues = [];
      for (value in valuesArray) {
        if (interaction.member.roles.cache.has(valuesArray[value])) {
          interaction.member.roles.remove(valuesArray[value]);
          valuesArray[value] = `<@&${valuesArray[value]}>`;
          removeValues.push(valuesArray[value])
        }
        else {
          interaction.member.roles.add(valuesArray[value]);
          valuesArray[value] = `<@&${valuesArray[value]}>`;
          addValues.push(valuesArray[value])
        }
      }
      if (addValues.length > 0) addValues = addValues.join(", ")
      else addValues = "Aucun"
      if (removeValues.length > 0) removeValues = removeValues.join(", ")
      else removeValues = "Aucun"
      interaction.reply({
        content: `Tu as reçu le(s) role(s) suivant(s) : **${addValues}** et perdu le(s) role(s) suivant(s) : ${removeValues}`,
        ephemeral: true,
      });
    }
  }

  const embed = new MessageEmbed()

    .setAuthor({ name: interaction.user.id, iconURL: interaction.user.displayAvatarURL() })
    .setDescription(`${interaction.user} a fait une intéraction de type : **${interaction.type}** dans le channel ${interaction.channel} (${interaction.channelId})`)
    .setTimestamp()
    .setColor("#FF9610");

  client.channels.fetch(client.serverSettings.interactionLogsChannelId).then(c => c.send({ embeds: [embed] }));
};