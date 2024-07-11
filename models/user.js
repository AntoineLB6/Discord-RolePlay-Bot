const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    infosRP: {
        name: {
            "type": String,
            "default": ""
        },
        age: {
            "type": Number,
            "default": 0
        },
        sexe: {
            "type": String,
            "default": ""
        },
        race: {
            "type": String,
            "default": "Humain"
        },
        origine: {
            "type": String,
            "default": ""
        },
        grimoire: {
            magie: {
                "type": String,
                "default": "Aucune"
            },
            rank: {
                "type": String,
                "default": "Inconnu"
            },
            ere: {
                "type": String,
                "default": "Actuelle"
            },
        },
        compagnie: {
            "type": String,
            "default": ""
        },
        apparence: {
            "type": String,
            "default": "https://blog.soat.fr/wp-content/uploads/2016/01/Unknown.png"
        },
        sorts: [],
    },
    stats: {
        vitalite: {
            "type": Number,
            "default": 0
        },
        force: {
            "type": Number,
            "default": 0
        },
        resistance: {
            "type": Number,
            "default": 0
        },
        agilite: {
            "type": Number,
            "default": 0
        },
        reserveMagique: {
            "type": Number,
            "default": 0
        },
        maitriseMagique: {
            "type": Number,
            "default": 0
        },
        pointsLeft: {
            "type": Number,
            "default": 0
        },
        balance: {
            "type": Number,
            "default": 0,
        },
        xp: {
            "type": Number,
            "default": 0,
        },
        lvl: {
            "type": Number,
            "default": 1,
        },
        mana: {
            "type": Number,
            "default": 0,
        },
    },
    profil: {
        mainColor: {
            "type": String,
            "default": "#ffffff"
        },
        secondaryColor: {
            "type": String,
            "default": "#FF0000"
        },
        background: {
            "type": String,
            "default": "https://media.discordapp.net/attachments/876577400023052381/973953907736838224/unknown.png?width=1106&height=622"
        },
        customStatus: {
            "type": String,
            "default": ""
        },
    },
    status: {
        statusList: [],
        sleeping: {
            "type": Boolean,
            "default": false
        },
        KO: {
            "type": Boolean,
            "default": false
        },
        wanted: {
            "type": Boolean,
            "default": false
        },
        localisation: {
            localisation: {
                "type": String,
                "default": "Neutre"
            },
            localisationID: {
                "type": String,
                "default": ""
            },
        },
    },
    inventory: [],
    trains: {
        weekly: {
        "type": Number,
        "default": 3,
        "max": 3
        },
        daily: {
            "type": Boolean,
            "default": true
        }
    }
});

module.exports = mongoose.model("User", userSchema);
