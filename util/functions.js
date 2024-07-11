const mongoose = require("mongoose");
const { User, Guild, Invite } = require("../models/index");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const sharp = require("sharp");
const axios = require("axios");

module.exports = client => {

    client.createGuild = async () => {
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() });
        const createGuild = await new Guild(merged);
        await createGuild.save();
    };

    client.getGuild = async () => {
        const data = await Guild.find();
        if (data) return data[0];
    };

    client.updateGuild = async (settings) => {
        let data = await client.getGuild();
        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    };

    client.createUser = async (user, userData) => {
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() },
            userData);
        const createUser = await new User(merged);
        await createUser.save();
    };

    client.getUser = async (user) => {
        const data = await User.findOne({ userID: user.id });
        if (data) return data;
    };

    client.getUsers = async () => {
        const data = await User.find();
        if (data) return data;
    };

    client.updateUser = async (user, settings) => {
        let data = await client.getUser(user);
        
        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    };

    client.createInvite = async user => {
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() },
            user);
        const createUser = await new Invite(merged);
        createUser.save();
    };

    client.getInvite = async (user) => {
        const data = await Invite.findOne({ userID: user.id });
        if (data) return data;
    };

    client.addPts = async (member, nbpts) => {
        const userToUpdate = await client.getUser(member);
        const updated = userToUpdate.stats.pointsLeft + nbpts;
        await client.updateUser(member, { "stats.pointsLeft": updated });
    };
    client.removePts = async (member, nbpts) => {
        const userToUpdate = await client.getUser(member);
        const updated = userToUpdate.stats.pointsLeft - nbpts;
        await client.updateUser(member, { "stats.pointsLeft": updated });
    };
    client.addXP = async (member, nbxp) => {
        const userToUpdate = await client.getUser(member);
        const updated = userToUpdate.stats.xp + nbxp;
        await client.updateUser(member, { "stats.xp": updated });
    };
    client.removeXP = async (member, nbxp) => {
        const userToUpdate = await client.getUser(member);
        const updated = userToUpdate.stats.xp - nbxp;
        await client.updateUser(member, { "stats.xp": updated });
    };
    client.addBalance = async (member, nbpts) => {
        const userToUpdate = await client.getUser(member);
        const updated = userToUpdate.stats.balance + nbpts;
        await client.updateUser(member, { "stats.balance": updated });
    }
    client.removeBalance = async (member, nbpts) => {
        const userToUpdate = await client.getUser(member);
        const updated = userToUpdate.stats.balance - nbpts;
        await client.updateUser(member, { "stats.balance": updated });
    }

    client.setName = async (user) => {
        const dbUser = await client.getUser(user);
        let status = [];
        if (dbUser.status.statusList.length === 0 && dbUser.profil.customStatus) status.push(dbUser.profil.customStatus);
        else if (dbUser.status.statusList.length === 0) status.push("🟢");
        else {
            for (thisStatus of dbUser.status.statusList) {
            switch (thisStatus) {
            case "Combat": {
                status.push("⚔️");
                break;
            }
            case "Endormi": {
                status.push("🛌");
                break;
            }
            case "KO": {
                status.push("💫");
                break;
            }
            case "Masqué": {
                status.push("🎭");
                break;
            }
            case "Recherché": {
                status.push("💀");
                break;
            }
            case "Riche": {
                status.push("💰");
                break;
            }
        }
        }
    }
        const name = dbUser.infosRP.name;

        const mainGuild = await client.guilds.fetch(client.serverSettings.mainServerId);
        const mainGuildMember = await mainGuild.members.fetch(user.id);
        await mainGuildMember.setNickname(`${name} (${status.join("/")})`, "Bot Status Modifier").catch(err => client.channels.cache.get(client.serverSettings.errorLogsChannelId).send(`<@496044799024168997>, je n'ai pas pu modifier le nom de ${user}\nErreur : ${err}`));
    }

    client.reloadStatus = async (user) => {
        const dbUser = await client.getUser(user);
        const dbGuild = await client.getGuild();
        const statusList = [];

        const combat = await dbGuild.combats.find(c => c.participants.includes(user.id));
        if (combat) statusList.push("Combat");
        if (dbUser.status.sleeping) statusList.push("Endormi");
        if (dbUser.status.KO) statusList.push("KO");
        if (dbUser.inventory.includes("Masque")) statusList.push("Masqué");
        if (dbUser.status.wanted) statusList.push("Recherché");
        if (dbUser.stats.balance > 10000) statusList.push("Riche");

        await client.updateUser(user, { "status.statusList": statusList });
        await client.setName(user)
    }

    client.getShop = async (page, user) => {
        const dbUser = await client.getUser(user);
        const dbGuild = await client.getGuild();
        const itemsShop = dbGuild.shop;
        const filteredItems = itemsShop.filter(function(item) {
            return item.zones.includes(dbUser.status.localisation.localisation);
        })

        const itemsList = await filteredItems.sort(function (a, b) {
            return a.prix - b.prix;
        });
        const itemsPage = itemsList.slice(
            page * 10 - 10,
            page * 10
        );
        const maxPage = await Math.ceil(itemsList.length / 10);

        let embed = new MessageEmbed()

            .setTitle("Shop :")
            .setDescription(`Localisation : ${dbUser.status.localisation.localisation}`)
            .setFooter({ text: `Page ${page}/${maxPage}` })
            .setColor("#FF9610");

        if (itemsList.length > 0) {
            for (const item in itemsPage) {
                let desc_ellipsis
                if (itemsPage[item].description.length > 100) {
                    const desc_cut = await itemsPage[item].description.slice(0, 96);
                    desc_ellipsis = await desc_cut + "..."
                } else desc_ellipsis = await itemsPage[item].description;
                await embed.addField(`${itemsPage[item].prix} - ${itemsPage[item].name}`, desc_ellipsis)
            }
        } else await embed.setDescription(`Localisation : ${dbUser.status.localisation.localisation}\n\nVide`);
        return embed;
    }

    client.getInventaire = async (page, member) => {
        const dbUser = await client.getUser(member);
        const itemsList = await dbUser.inventory;

        const itemsPage = itemsList.slice(
            page * 10 - 10,
            page * 10
        );
        const maxPage = await Math.ceil(itemsList.length / 10);

        let embed = new MessageEmbed()

            .setTitle("Inventaire :")
            .setColor("#FF9610");

        if (itemsList.length > 0) {
            embed.setDescription(itemsPage.join("\n\n")).setFooter({ text: `Page ${page}/${maxPage}` });
        } else await embed.setDescription(`Vide`);
        return embed;
    }

    client.loadInfoEmbed = async (commanduser) => {

        const dbCommandUser = await client.getUser(commanduser);
        let embed = new MessageEmbed()

            .setAuthor({ name: `Informations de ${commanduser.user.tag}`, iconURL: commanduser.user.avatarURL() })
            .setTitle("Que souhaitez-vous modifier ?")
            .setDescription(`**__Nom :__   ${dbCommandUser.infosRP.name}\n__Âge :__   ${dbCommandUser.infosRP.age}\n__Sexe :__   ${dbCommandUser.infosRP.sexe}\n__Race :__   ${dbCommandUser.infosRP.race}\n__Origine :__   ${dbCommandUser.infosRP.origine}\n__Magie :__   ${dbCommandUser.infosRP.grimoire.magie}\n__Rang de Grimoire :__   ${dbCommandUser.infosRP.grimoire.rank}\n__Ere du Grimoire :__   ${dbCommandUser.infosRP.grimoire.ere}\n__Compagnie :__   ${dbCommandUser.infosRP.compagnie}\n__Apparence :__   ${dbCommandUser.infosRP.apparence}**`)

            .setColor("#00B8FF");

        return embed;
    }

    client.loadStatEmbed = async (commanduser) => {
        const dbCommandUser = await client.getUser(commanduser);
        let embed = new MessageEmbed()

            .setAuthor({ name: `Informations de ${commanduser.user.tag}`, iconURL: commanduser.user.avatarURL() })
            .addFields([
                { name: "Vitalité", value: dbCommandUser.stats.vitalite.toString(), inline: true },
                { name: "Force", value: dbCommandUser.stats.force.toString(), inline: true },
                { name: "Résistance", value: dbCommandUser.stats.resistance.toString(), inline: true },
                { name: "Agilité", value: dbCommandUser.stats.agilite.toString(), inline: true },
                { name: "Réserve Magique", value: dbCommandUser.stats.reserveMagique.toString(), inline: true },
                { name: "Maîtrise Magique", value: dbCommandUser.stats.maitriseMagique.toString(), inline: true },
                { name: "Points de Stats Vacants", value: dbCommandUser.stats.pointsLeft.toString(), inline: false },
                { name: "Monnaie", value: dbCommandUser.stats.balance.toString(), inline: false },
                { name: "XP", value: dbCommandUser.stats.xp.toString(), inline: false },
                { name: "Niveau", value: dbCommandUser.stats.lvl.toString(), inline: false },
            ])
            .setColor("#00B8FF");

        return embed;
    }

    client.loadProfilEmbed = async (commanduser) => {

        const dbCommandUser = await client.getUser(commanduser);
        let embed = new MessageEmbed()

            .setAuthor({ name: `Informations de ${commanduser.user.tag}`, iconURL: commanduser.user.avatarURL() })
            .setTitle("Que souhaitez-vous modifier ?")
            .setDescription(`**__Couleur de profil principale :__   ${dbCommandUser.profil.mainColor}\n__Couleur de profil secondaire :__   ${dbCommandUser.profil.secondaryColor}\n__Fond :__   ${dbCommandUser.profil.background}**`)

            .setColor("#00B8FF");

        return embed;
    }

    client.loadInfoPersoInfoEmbed = async (commanduser) => {
        const dbCommandUser = await client.getUser(commanduser);

        const canvas = createCanvas(1500, 800);
        const ctx = canvas.getContext("2d");
        const requestImage = (await axios({ url: dbCommandUser.profil.background, responseType: "arraybuffer" })).data;
        const backgroundImage = await sharp(requestImage)
            .resize(1500, 800)
            .png()
            .toBuffer();
        const background = await loadImage(backgroundImage);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        let sexeImageLink;
        if (dbCommandUser.infosRP.sexe === "Femme") sexeImageLink = "./assets/canvas/icon-female-white.png";
        else sexeImageLink = "./assets/canvas/icon-male-white.png"
        const sexe = await loadImage(sexeImageLink);
        ctx.drawImage(sexe, 295, 20, 100, 100);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = dbCommandUser.profil.mainColor;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#000";
        ctx.fillRect(200, 630, 1100, 70);
        ctx.globalAlpha = 1;
        ctx.strokeRect(200, 630, 1100, 70);

        ctx.fillStyle = dbCommandUser.profil.secondaryColor;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(202, 632, (dbCommandUser.stats.xp / (dbCommandUser.stats.lvl * 30) * 1094), 66);

        ctx.globalAlpha = 1;
        ctx.font = "100px Arial";
        ctx.fillStyle = dbCommandUser.profil.mainColor;
        ctx.strokeStyle = dbCommandUser.profil.secondaryColor;
        ctx.textAlign = "center";
        ctx.fillText(`${dbCommandUser.infosRP.name}`, 930, 160);
        ctx.strokeText(`${dbCommandUser.infosRP.name}`, 930, 160)
        ctx.font = "60px Arial";
        ctx.fillText(`Niveau ${dbCommandUser.stats.lvl}`, canvas.width / 2, 765);
        ctx.font = "45px Arial";
        ctx.fillText(`${dbCommandUser.stats.xp} / ${dbCommandUser.stats.lvl * 30} XP`, (canvas.width / 2), 680);
        ctx.font = "65px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`${dbCommandUser.infosRP.age} ans`, 50, 370);
        ctx.fillText(`${dbCommandUser.infosRP.race}`, 300, 370);
        ctx.fillText(`${dbCommandUser.infosRP.origine}`, 600, 370);
        ctx.fillText(`${dbCommandUser.infosRP.grimoire.rank} | ${dbCommandUser.infosRP.grimoire.magie}`, 50, 470);

        ctx.fillStyle = dbCommandUser.profil.secondaryColor;
        ctx.strokeStyle = dbCommandUser.profil.secondaryColor;
        ctx.beginPath();
        ctx.arc(175, 155, 139, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(175, 155, 130, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const requestImage2 = (await axios({ url: dbCommandUser.infosRP.apparence, responseType: "arraybuffer" })).data;
        const apparenceImage = await sharp(requestImage2)
            .resize(520, 520)
            .png()
            .toBuffer();

        const apparence = await loadImage(apparenceImage);
        ctx.drawImage(apparence, 45, 21, 265, 265);


        const infoPersoImg = new MessageAttachment(canvas.toBuffer(), "infoPerso.png");

        let embed = new MessageEmbed()

            .setAuthor({ name: `Informations de ${commanduser.user.tag}`, iconURL: commanduser.user.avatarURL() })
            .setImage('attachment://infoPerso.png')
            .setColor("#00B8FF");

        return { embed, infoPersoImg };
    }

    client.loadInfoPersoInfoEcritesEmbed = async (commanduser) => {
        const dbCommandUser = await client.getUser(commanduser);

        const canvas = createCanvas(1500, 800);
        const ctx = canvas.getContext("2d");
        const requestImage = (await axios({ url: dbCommandUser.profil.background, responseType: "arraybuffer" })).data;
        const backgroundImage = await sharp(requestImage)
            .resize(1500, 800)
            .png()
            .toBuffer();
        const background = await loadImage(backgroundImage);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        let sexeImageLink;
        if (dbCommandUser.infosRP.sexe === "Femme") sexeImageLink = "./assets/canvas/icon-female-white.png";
        else sexeImageLink = "./assets/canvas/icon-male-white.png"
        const sexe = await loadImage(sexeImageLink);
        ctx.drawImage(sexe, 295, 20, 100, 100);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = dbCommandUser.profil.mainColor;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#000";
        ctx.fillRect(200, 630, 1100, 70);
        ctx.globalAlpha = 1;
        ctx.strokeRect(200, 630, 1100, 70);

        ctx.fillStyle = dbCommandUser.profil.secondaryColor;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(202, 632, (dbCommandUser.stats.xp / (dbCommandUser.stats.lvl * 30) * 1094), 66);

        ctx.globalAlpha = 1;
        ctx.font = "100px Arial";
        ctx.fillStyle = dbCommandUser.profil.mainColor;
        ctx.strokeStyle = dbCommandUser.profil.secondaryColor;
        ctx.textAlign = "center";
        ctx.fillText(`${dbCommandUser.infosRP.name}`, 930, 160);
        ctx.strokeText(`${dbCommandUser.infosRP.name}`, 930, 160)
        ctx.font = "60px Arial";
        ctx.fillText(`Niveau ${dbCommandUser.stats.lvl}`, canvas.width / 2, 765);
        ctx.font = "45px Arial";
        ctx.fillText(`${dbCommandUser.stats.xp} / ${dbCommandUser.stats.lvl * 30} XP`, (canvas.width / 2), 680);
        ctx.font = "65px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`${dbCommandUser.infosRP.age} ans`, 50, 370);
        ctx.fillText(`${dbCommandUser.infosRP.race}`, 300, 370);
        ctx.fillText(`${dbCommandUser.infosRP.origine}`, 600, 370);
        ctx.fillText(`${dbCommandUser.infosRP.grimoire.rank} | ${dbCommandUser.infosRP.grimoire.magie}`, 50, 470);

        ctx.fillStyle = dbCommandUser.profil.secondaryColor;
        ctx.strokeStyle = dbCommandUser.profil.secondaryColor;
        ctx.beginPath();
        ctx.arc(175, 155, 139, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(175, 155, 130, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const requestImage2 = (await axios({ url: dbCommandUser.infosRP.apparence, responseType: "arraybuffer" })).data;
        const apparenceImage = await sharp(requestImage2)
            .resize(520, 520)
            .png()
            .toBuffer();

        const apparence = await loadImage(apparenceImage);
        ctx.drawImage(apparence, 45, 21, 265, 265);


        const infoPersoImg = new MessageAttachment(canvas.toBuffer(), "infoPerso.png");

        let descriptionData = `**__Nom :__   ${dbCommandUser.infosRP.name}\n__Âge :__   ${dbCommandUser.infosRP.age}\n__Sexe :__   ${dbCommandUser.infosRP.sexe}\n__Race :__   ${dbCommandUser.infosRP.race}\n__Origine :__   ${dbCommandUser.infosRP.origine}\n__Magie :__   ${dbCommandUser.infosRP.grimoire.magie}\n__Rang de Grimoire :__   ${dbCommandUser.infosRP.grimoire.rank}`;
        if (dbCommandUser.infosRP.grimoire.ere !== "Actuelle") descriptionData += `\n__Ere du Grimoire :__   ${dbCommandUser.infosRP.grimoire.ere}`;
        if (dbCommandUser.infosRP.compagnie) descriptionData += `\n__Compagnie :__   ${dbCommandUser.infosRP.compagnie}`;
        descriptionData += "**";

        let embed = new MessageEmbed()

            .setAuthor({ name: `Informations de ${commanduser.user.tag}`, iconURL: commanduser.user.avatarURL() })
            .setDescription(descriptionData)
            .addFields([
                { name: "Monnaie", value: dbCommandUser.stats.balance.toString(), inline: true },
                { name: "XP", value: dbCommandUser.stats.xp.toString(), inline: true },
                { name: "Niveau", value: dbCommandUser.stats.lvl.toString(), inline: true },
            ])
            .setImage('attachment://infoPerso.png')
            .setColor("#00B8FF");

        return { embed, infoPersoImg };
    }

    client.loadInfoPersoEconomyEmbed = async (commanduser) => {
        const dbCommandUser = await client.getUser(commanduser);

        const canvas = createCanvas(1000, 1000);
        const ctx = canvas.getContext("2d");
        const background = await loadImage("./assets/canvas/background_economy.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 1;
        ctx.font = "100px Arial";
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = dbCommandUser.profil.color;
        ctx.textAlign = "center";
        ctx.fillText(`${dbCommandUser.infosRP.name}`, canvas.width / 2, 400);
        ctx.strokeText(`${dbCommandUser.infosRP.name}`, canvas.width / 2, 400)
        ctx.font = "60px Arial";
        ctx.fillText(`Balance : ${dbCommandUser.stats.balance}`, canvas.width / 2, 600);

        const economyImg = new MessageAttachment(canvas.toBuffer(), "economy.png");

        let embed = new MessageEmbed()

            .setAuthor({ name: `Informations de ${commanduser.user.tag}`, iconURL: commanduser.user.avatarURL() })
            .setImage('attachment://economy.png')
            .setColor("#00B8FF");

        return { embed, economyImg };
    }

    client.loadInfoPersoStatEmbed = async (commanduser) => {
        const dbCommandUser = await client.getUser(commanduser);

        let embed = new MessageEmbed()

            .setAuthor({ name: `Informations de ${commanduser.user.tag}`, iconURL: commanduser.user.avatarURL() })
            .addFields([
                { name: "Vitalité", value: dbCommandUser.stats.vitalite.toString(), inline: true },
                { name: "Force", value: dbCommandUser.stats.force.toString(), inline: true },
                { name: "Résistance", value: dbCommandUser.stats.resistance.toString(), inline: true },
                { name: "Agilité", value: dbCommandUser.stats.agilite.toString(), inline: true },
                { name: "Réserve Magique", value: dbCommandUser.stats.reserveMagique.toString(), inline: true },
                { name: "Maîtrise Magique", value: dbCommandUser.stats.maitriseMagique.toString(), inline: true },
                { name: "Points de Stats Vacants", value: dbCommandUser.stats.pointsLeft.toString(), inline: false },
            ])
            .setColor("#00B8FF");

        return embed;
    }

    client.loadInfoPersoCountEmbed = async (commanduser) => {
        const dbCommandUser = await client.getUser(commanduser);

        let embed = new MessageEmbed()
            .setAuthor({ name: commanduser.user.tag, iconURL: commanduser.user.avatarURL() })
            .setDescription(`**Combien de points voulez-vous ajouter ?**\nPoints de stats Vacants : ${dbCommandUser.stats.pointsLeft}`)
            .setFooter({ text: "Vous pouvez annuler la commande à tout moment en tapant : `.exit`" })
            .setColor("#FF10AF");

        return embed;
    }
    client.loadInfoPersoMoneyEmbed = async (commanduser) => {
        const dbCommandUser = await client.getUser(commanduser);

        let embed = new MessageEmbed()
            .setAuthor({ name: commanduser.user.tag, iconURL: commanduser.user.avatarURL() })
            .setDescription(`**Combien voulez-vous lui donner ?**\nMonnaie : ${dbCommandUser.stats.balance}`)
            .setFooter({ text: "Vous pouvez annuler la commande à tout moment en tapant : `.exit`" })
            .setColor("#FF10AF");

        return embed;
    }

    client.majLb = async (client) => {
        const leaderBoardChannel = await client.channels.fetch(client.serverSettings.leaderBoardChannelId);
        let fetchedMessages = await leaderBoardChannel.messages.fetch();
        let leaderBoardMessages = await fetchedMessages.filter(message => message.author.id === client.user.id);

        if (leaderBoardMessages.size !== 3) {
            if (leaderBoardMessages.size < 0) await leaderBoardChannel.bulkDelete(fetchedMessages.size);
            for (let i = 1; i <= 3; i++) {
                let embed = new MessageEmbed()
                    .setTitle("Loading");
                await leaderBoardChannel.send({ embeds: [embed] });
            }
        }

        fetchedMessages = await leaderBoardChannel.messages.fetch();
        leaderBoardMessages = await fetchedMessages.filter(message => message.author.id === client.user.id);
        leaderBoardMessages = Array.from(leaderBoardMessages);

        for (message in leaderBoardMessages) {
            switch (message) {
                case "0": {
                    let persos = await client.getUsers();
                    persos = persos.sort((a, b) => b.stats.balance - a.stats.balance);
                    persos = persos.splice(0, 10);

                    let embed = new MessageEmbed()
                        .setTitle("LeaderBoard du personnage le plus riche :");

                    for (const data of persos) {
                        embed.addField(data.infosRP.name, `(<@${data.userID}>) | ${data.stats.balance} :moneybag:.`)
                    }

                    await leaderBoardMessages[message][1].edit({ embeds: [embed] });
                    break;
                }
                case "1": {
                    let persos = await client.getUsers();
                    for (perso of persos) {
                        perso.allPoints = perso.stats.vitalite + perso.stats.force + perso.stats.resistance + perso.stats.agilite + perso.stats.reserveMagique + perso.stats.maitriseMagique;
                    }
                    persos = persos.sort((a, b) => b.allPoints - a.allPoints);
                    persos = persos.splice(0, 10);

                    let embed = new MessageEmbed()
                        .setTitle("LeaderBoard du personnage avec le plus de points de stat :");

                    for (const data of persos) {
                        embed.addField(data.infosRP.name, `(<@${data.userID}>) | ${data.allPoints} points.`)
                    }

                    await leaderBoardMessages[message][1].edit({ embeds: [embed] });
                    break;
                }
                case "2": {
                    let persos = await client.getUsers();
                    persos = persos.sort((a, b) => b.stats.lvl - a.stats.lvl || b.stats.xp - a.stats.xp);
                    persos = persos.splice(0, 10);

                    let embed = new MessageEmbed()
                        .setTitle("LeaderBoard du personnage le plus haut niveau :");

                    for (const data of persos) {
                        embed.addField(data.infosRP.name, `(<@${data.userID}>) | Niveau ${data.stats.lvl} - ${data.stats.xp} XP.`)
                    }
                    await leaderBoardMessages[message][1].edit({ embeds: [embed] });
                    break;
                }
            }
        }
        console.log('LeaderBoard réactualisé');
    }

    client.addPointsStats = async (message, i, commanduser, row, stat) => {
        const dbCommandUser = await client.getUser(commanduser);

        const interactionfilter = i => {
            return i.user.id === message.author.id;
        };
        const msgfilter = m => m.author.id === message.author.id;

        const count_embed = await client.loadInfoPersoCountEmbed(commanduser);
        await i.editReply({ embeds: [count_embed], components: [] });
        let verif = true;
        let pointsToAdd = 0;
        let collectorValue;
        let confirmationInteraction;
        while (verif) {
            try {
                collectorValue = await i.channel.awaitMessages({ filter: msgfilter, max: 1, time: 120000, errors: ["time"] });
                if (!collectorValue) return message.channel.send("**Aucun message n'a été collecté, la commande a été annulée.**");
                if (collectorValue.first().content === ".exit") {
                    let stats_embed = await client.loadInfoPersoStatEmbed(commanduser);
                    if (collectorValue.first().deletable) collectorValue.first().delete();
                    verif = false;
                    return await i.editReply({ embeds: [stats_embed], components: [row.main, row.statsRow1, row.statsRow2] });;
                }
                pointsToAdd = collectorValue.first().content;
                pointsToAdd = parseInt(pointsToAdd);
                const majority = await client.isMajority(commanduser, stat, pointsToAdd);
                if (isNaN(pointsToAdd)) message.channel.send("Ceci n'est pas un chiffre.").then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                })
                else if (pointsToAdd > dbCommandUser.stats.pointsLeft) message.channel.send("Vous n'avez pas assez de points.").then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                })
                else if (majority) message.channel.send("Vous ne pouvez pas mettre plus de 50% de vos points de stat dans une même statistique.").then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                })
                else {
                    verif = false
                }
                if (collectorValue.first().deletable) await collectorValue.first().delete();
            } catch (err) {
                message.channel.send("**Vous avez dépassé la durée limite, la commande a été annulée.**");

                let stats_embed = await client.loadInfoPersoStatEmbed(commanduser);
                return await i.editReply({ embeds: [stats_embed], components: [row.main, row.statsRow1, row.statsRow2] });
            }
        }

        const confirmation_embed = new MessageEmbed()
            .setAuthor({ name: commanduser.user.tag, iconURL: commanduser.user.avatarURL() })
            .setDescription(`**Cette action est irrévocable, êtes-vous sûr de votre décision ?**`)
            .setColor("#FF0000");

        await i.editReply({ embeds: [confirmation_embed], components: [row.confirmationButtons] });
        try {
            confirmationInteraction = await i.message.awaitMessageComponent({ filter: interactionfilter, componentType: 'BUTTON', time: 120000 });
            const confirmation = confirmationInteraction.customId;
            if (confirmation === "oui") {
                await client.updateUser(commanduser, { "stats.pointsLeft": dbCommandUser.stats.pointsLeft - pointsToAdd });
                const thisStat = eval(`dbCommandUser.stats.${stat}`)
                await client.updateUser(commanduser, { [`stats.${stat}`]: thisStat + pointsToAdd });

                const logs_embed = new MessageEmbed()
                    .setAuthor({ name: commanduser.user.tag, iconURL: commanduser.user.avatarURL() })
                    .setDescription(`**${commanduser.user} a ajouté ${pointsToAdd} points en force à son personnage.**`)
                    .setColor("#26D6FF");
                client.channels.cache.get(client.serverSettings.persoLogsChannelId).send({ embeds: [logs_embed] });
            }
        } catch (err) {
            message.channel.send("**Erreur détectée !**");
            let stats_embed = await client.loadInfoPersoStatEmbed(commanduser);
            return await i.editReply({ embeds: [stats_embed], components: [row.main, row.statsRow1, row.statsRow2] });
        }

        let stats_embed = await client.loadInfoPersoStatEmbed(commanduser);
        await i.editReply({ embeds: [stats_embed], components: [row.main, row.statsRow1, row.statsRow2] });
    }

    client.isMajority = async (commanduser, stat, points) => {
        const dbCommandUser = await client.getUser(commanduser);

        let statList = [dbCommandUser.stats.vitalite, dbCommandUser.stats.force, dbCommandUser.stats.resistance, dbCommandUser.stats.agilite, dbCommandUser.stats.reserveMagique, dbCommandUser.stats.maitriseMagique, dbCommandUser.stats.pointsLeft];
        let selectedStat = await eval(`dbCommandUser.stats.${stat}`);
        const index = statList.indexOf(selectedStat);
        statList.splice(index, 1);
        let otherPoints = 0;

        for (stat of statList) {
            otherPoints += stat;
        }

        if (selectedStat + points > otherPoints / 2) return true;
        else return false;
    }
};
