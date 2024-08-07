const MESSAGES = {
  COMMANDS: {
    ADMINISTRATION: {
      DELETE_PERSO: {
        name: "delete-perso",
        aliases: ["delete-perso"],
        category: "administration",
        description: "Supprime le personnage d'un joueur.",
        cooldown: 3,
        usage: "<Membre>",
        isUserStaff: true,
        isUserRP: false,
        args: true,
        permissions: false,
        ownerOnly: false,
      },
      ADDPTS: {
        name: "addpts",
        aliases: ["add-pts"],
        category: "admin",
        description: "Ajoute des points à un joueur.",
        cooldown: 3,
        usage: "<Mention_Membre> <Nombre>",
        isUserStaff: true,
        isUserRP: false,
        args: true,
        permissions: true,
        permissionsList: ["MANAGE_MESSAGES"],
        ownerOnly: false
      },
      REMOVEPTS: {
        name: "removepts",
        aliases: ["remove-pts"],
        category: "administration",
        description: "Retire des points à un joueur.",
        cooldown: 3,
        usage: "<Mention_Membre> <Nombre>",
        isUserStaff: true,
        isUserRP: false,
        args: true,
        permissions: true,
        permissionsList: ["MANAGE_MESSAGES"],
        ownerOnly: false
      },
      JSONEMBED: {
        name: "jsonembed",
        aliases: ["json"],
        category: "administration",
        description: "",
        cooldown: 3,
        usage: "<channel> <JSON>",
        isUserStaff: false,
        isUserRP: false,
        args: true,
        permissions: false,
        ownerOnly: true
      },
      ADDMONEY: {
        name: "addmoney",
        aliases: ["add-money"],
        category: "administration",
        description: "Ajoute de l'argent à un joueur.",
        cooldown: 3,
        usage: "<Mention_Membre> <Nombre>",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: true,
        permissionsList: ["MANAGE_MESSAGES"],
        ownerOnly: false,
      },
      REMOVEMONEY: {
        name: "removemoney",
        aliases: ["remove-money"],
        category: "administration",
        description: "Retire de l'argent à un joueur.",
        cooldown: 3,
        usage: "<Mention_Membre> <Nombre>",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: true,
        permissionsList: ["MANAGE_MESSAGES"],
        ownerOnly: false,
      },
      DELETE_INCOME: {
        name: "delete-income",
        aliases: ["delete-income"],
        category: "administration",
        description: "Supprime un salaire.",
        cooldown: 3,
        usage: "<Role>",
        isUserStaff: true,
        isUserRP: false,
        args: true,
        permissions: false,
        ownerOnly: false,
      },
      CREATE_INCOME: {
        name: "create-income",
        aliases: ["create-income"],
        category: "administration",
        description: "Crée un nouveau salaire.",
        cooldown: 3,
        usage: "",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      CREATE_ITEM: {
        name: "create-item",
        aliases: ["createitem"],
        category: "administration",
        description: "Ajoute un objet au shop.",
        cooldown: 3,
        usage: "",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      DELETE_ITEM: {
        name: "delete-item",
        aliases: ["deleteitem"],
        category: "administration",
        description: "Supprime un objet du shop.",
        cooldown: 3,
        usage: "<item>",
        isUserStaff: true,
        isUserRP: false,
        args: true,
        permissions: false,
        ownerOnly: false,
      },
      GIVEITEM: {
        name: "giveitem",
        aliases: ["give-item"],
        category: "administration",
        description: "Donne un objet à un joueur.",
        cooldown: 3,
        usage: "",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      TAKEITEM: {
        name: "takeitem",
        aliases: ["take-item"],
        category: "administration",
        description: "Supprime un objet à un joueur.",
        cooldown: 3,
        usage: "",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      EDIT_PERSO: {
        name: "edit-perso",
        aliases: ["editperso"],
        category: "administration",
        description: "Modifie le personnage d'un joueur.",
        cooldown: 3,
        usage: "",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      MAJ_LEADERBOARD: {
        name: "maj-leaderboard",
        aliases: ["maj-lb"],
        category: "administration",
        description: "Met à jour manuellement le leaderboard.",
        cooldown: 3,
        usage: "",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      CREATE_GUILD: {
        name: "create-guild",
        aliases: ["create-guild"],
        category: "administration",
        description: "...",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: true,
      },
      VERIF_TRAIN: {
        name: "verif-train",
        aliases: ["verif-train"],
        category: "administration",
        description: "Valide l'entraînement d'un joueur.",
        cooldown: 3,
        usage: "",
        isUserStaff: true,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      WANTED: {
        name: "wanted",
        aliases: ["wanted"],
        category: "admin",
        description: "Permet d'afficher une personne comme recherché.",
        cooldown: 3,
        usage: "",
        isUserStaff: true,
        isUserRP: false,
        args: true,
        permissions: false,
        ownerOnly: false,
      },
    },
    ECONOMY: {
      BUYITEM: {
        name: "buyitem",
        aliases: ["buy-item"],
        category: "economy",
        description: "Permet d'acheter un item.",
        cooldown: 3,
        usage: "[<objet>]",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      ITEMINFO: {
        name: "iteminfo",
        aliases: ["item-info"],
        category: "economy",
        description: "Affiche les détails de l'item.",
        cooldown: 3,
        usage: "[<objet>]",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      SHOP: {
        name: "shop",
        aliases: ["shop"],
        category: "economy",
        description: "Affiche le magasin du serveur.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      COLLECT_INCOME: {
        name: "collect-income",
        aliases: ["collect-income"],
        category: "economy",
        description: "Récupère le salaire.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
    },
    MISC: {
      HELP: {
        name: "help",
        aliases: ["help"],
        category: "misc",
        description: "Renvoie la liste des commandes avec leurs informations.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false
      },
      SAY: {
        name: "say",
        aliases: ["say"],
        category: "misc",
        description: "Renvoie le message dans un embed.",
        cooldown: 3,
        usage: "<Votre_message>",
        isUserStaff: true,
        isUserRP: false,
        args: true,
        permissions: false,
        ownerOnly: false
      },
      INVITES: {
        name: "invites",
        aliases: ["invites"],
        category: "misc",
        description: "Donne votre nombre d'invitations.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false
      },
    },
    RP: {
      INFO_PERSO: {
        name: "info-perso",
        aliases: ["inf", "ip"],
        category: "rp",
        description: "Affiche les statistiques d'un joueur !",
        cooldown: 3,
        usage: "<JoueurAMentionné (facultatif)>",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false
      },
      ROLL: {
        name: "roll",
        aliases: ["roll"],
        category: "rp",
        description: "Détermine un chiffre aléatoire.",
        cooldown: 3,
        usage: "<NombreDeRoll>",
        isUserStaff: false,
        isUserRP: false,
        args: true,
        permissions: false,
        ownerOnly: false
      },
      CREATE_PERSO: {
        name: "create_perso",
        aliases: ["create-perso", "createperso"],
        category: "rp",
        description: "Permet de créer son personnage.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: false,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      EDIT_PROFIL: {
        name: "edit-profil",
        aliases: ["edit-profil"],
        category: "rp",
        description: "Permet de personnalisé le profil d'un joueur.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      START_COMBAT: {
        name: "start-combat",
        aliases: ["start-combat"],
        category: "rp",
        description: "Permet de lancer un combat.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      ADD_COMBAT: {
        name: "add-combat",
        aliases: ["add-combat"],
        category: "rp",
        description: "Permet d'ajouter un joueur à un combat.",
        cooldown: 3,
        usage: "<Mention>",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      REMOVE_COMBAT: {
        name: "remove-combat",
        aliases: ["remove-combat"],
        category: "rp",
        description: "Permet de retirer quelqu'un d'un combat.",
        cooldown: 3,
        usage: "<Mention>",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      END_COMBAT: {
        name: "end-combat",
        aliases: ["end-combat"],
        category: "rp",
        description: "Permet de finir un combat.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      ENTRAINEMENT: {
        name: "entrainement",
        aliases: ["entrainement"],
        category: "rp",
        description: "Permet de s'entrainer.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: true,
        args: false,
        permissions: false,
        ownerOnly: false,
      },
      KO: {
        name: "ko",
        aliases: ["ko"],
        category: "rp",
        description: "Demande à une personne si elle est KO et si oui, lui change son status.",
        cooldown: 3,
        usage: "",
        isUserStaff: false,
        isUserRP: true,
        args: true,
        permissions: false,
        ownerOnly: false,
      },
    }
  }
};

exports.MESSAGES = MESSAGES;
