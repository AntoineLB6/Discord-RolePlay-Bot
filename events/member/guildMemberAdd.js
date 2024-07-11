const { MessageEmbed, MessageAttachment } = require("discord.js");
const { Captcha } = require("captcha-canvas");
const { Invite } = require("../../models/index");

module.exports = async (client, member) => {
  const embed = new MessageEmbed()

    .setAuthor({ name: member.id, iconURL: member.user.displayAvatarURL() })
    .setDescription(`${member.user.tag} a rejoint le serveur ${member.guild.name}.`)
    .setTimestamp()
    .setColor("#FF9610");

  client.channels.fetch(client.serverSettings.memberLogsChannelId).then(c => c.send({ embeds: [embed] }));

  if (member.guild.id === client.serverSettings.mainServerId) {
    member.guild.invites.fetch().then(async newInvites => {
      const oldInvites = client.invites.get(member.guild.id);
      const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
      const inviter = client.users.cache.get(invite.inviter.id);

      let newMember = await client.getInvite(member);
      if (!newMember) {
        await client.createInvite({
          userID: member.id,
          inviter: inviter.id
        });
        newMember = await client.getInvite(member);
      }

      let dbInvite = await client.getInvite(inviter);
      if (!dbInvite) {
        await client.createInvite({
          userID: inviter.id,
          inviter: "Unknown"
        })
      }

      dbInvite = await Invite.findOneAndUpdate(
        { userID: inviter.id },
        {
          $push: {
            invites: member.id
          }
        },
        { "new": true, "upsert": true, "setDefaultsOnInsert": true }
      );


      const embed1 = new MessageEmbed()

        .setDescription(`・─═══✦═══─༺༻─═══✧═══─༺༻─═══✦═══─・\n\nBienvenue ${member.user} sur le serveur, ${member.guild.name}\n\n\n✦ Je t'invite à consulter nos règles, et les valider via le captcha dans le salon verif afin d'avoir accès à la totalité du serveur !\n~Faites attention de bien valider votre arrivée via le captcha dans les 5 minutes qui suivent votre apparition ici, dans le cas contraire le bot vous kickera en faisant attention tout de même de vous réinviter par MP~\n\n✧ N'oublie pas d'aller consulter le salon guide afin de tout savoir sur ce que vous devez faire en arrivant ici !`)
        .setColor("#f9ebab");

      const embed2 = new MessageEmbed()

        .setFooter({ text: "Au plaisir d'avoir pu te guider, j'espère que tu prendras du plaisir ici, bonne chance !" })
        .setColor("#f9ebab")
        .setImage("https://media.discordapp.net/attachments/987352240136265760/987703605006049351/secre-black-clover-gif.gif");

      const embed3 = new MessageEmbed()

        .setDescription(`・─═══✦═══─༺༻─═══✧═══─༺༻─═══✦═══─・`)
        .setColor("#f9ebab");
      client.channels.cache
        .get(client.serverSettings.welcomeChannelId)
        .send({
          content: `${inviter} a invité ${member}, il a ${dbInvite.invites.length} invitations.`,
          embeds: [embed1, embed2, embed3]
        });
      client.channels.cache
        .get(client.serverSettings.statsChannelId)
        .edit({ name: `⫷🍀⫸${member.guild.memberCount}-𝗠𝗲𝗺𝗯𝗿𝗲𝘀` });

      const captcha = new Captcha();
      captcha.async = true;
      captcha.addDecoy();
      captcha.drawTrace();
      captcha.drawCaptcha();

      const captchaAttachment = new MessageAttachment(
        await captcha.png,
        "captcha.png"
      );

      const captchaEmbed = new MessageEmbed()
        .setDescription("Veuillez compléter le captcha __en vert__ afin d'accéder au reste du serveur. (Faites attention, la différence entre les \"O\" et les \"0\" peut-être subtile, si votre message est refusé, tentez l'autre.)")
        .setImage("attachment://captcha.png");

      const verifyChannel = client.channels.cache
        .get(client.serverSettings.verifChannelId);

      const captchamsg = await verifyChannel.send({ files: [captchaAttachment], embeds: [captchaEmbed] });

      
      const filter = m => m.author.id === member.id;
      verif = true;
      while (verif) {
      try {
        const response = await verifyChannel.awaitMessages({
          filter,
          max: 1,
          time: 300000,
          errors: ["time"]
        });


          if (response.first().content.toUpperCase() === captcha.text.toUpperCase()) {
          member.roles.add(client.serverSettings.verifRoleId);
          verifyChannel.send(`${member} a passé la vérification.`).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
        captchamsg.delete();
        verif = false;
        } else {
          verifyChannel.send(`${member} captcha inccorect, tu peux réessayer.`).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
        }
        response.first().delete();
      } catch (err) {
        await member.send("Tu t'es fait expulser car tu n'as pas réussi le captcha au bout de 5 minutes, voici une invite du serveur au cas où cela serait n'aurait pas été fait exprès.\n\nhttps://discord.gg/EDweJ3JU4H\n\nSi vous avez un problème pour compléter le captcha, n'hésiter pas à me contacter : `Juubi 𝐗𝐗𝐕𝐈#3088` (ID Discord : 496044799024168997)");
        member.kick("Captcha");
        captchamsg.delete();
      }
    }

    });
  } else if (member.guild.id === client.serverSettings.ficheServerId) {
    member.guild.channels.create(`￤💮》${member.user.username}`, {
      type: 'GUILD_TEXT',
      permissionOverwrites: [
        {
          id: "968960589433032784",
          deny: ["SEND_MESSAGES"],
        },
        {
          id: "968963327801839688",
          allow: ["SEND_MESSAGES"],
        },
        {
          id: member.user.id,
          allow: ["SEND_MESSAGES"],
        },
      ],
    });
    member.guild.channels.create(`￤⛔️》${member.user.username}-private`, {
      type: 'GUILD_TEXT',
      permissionOverwrites: [
        {
          id: "968960589433032784",
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: "968963327801839688",
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: member.user.id,
          allow: ["VIEW_CHANNEL"],
        },
      ],
    });
  }

};