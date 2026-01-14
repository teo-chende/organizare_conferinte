const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const Utilizator = require("./utilizator");
const Conferinta = require("./conferinta");

// Tabela articol stochează informații generale despre articol
// Articolul efectiv (PDF) este stocat în VersiuneArticol
const Articol = sequelize.define('Articol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titlu: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM("submitted", "in_curs_de_evaluare", "acceptat", "revizuire", "respins"),
        defaultValue: "submitted"
    },
    conferintaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Conferinta,
            key: "id"
        },
        allowNull: false
    },
    autorId: {
        type: DataTypes.INTEGER,
        references: { 
            model: Utilizator, 
            key: 'id' 
        },
        allowNull: false
    }
}, {
    tableName: "Articole",
    timestamps: false
});

module.exports = Articol;
