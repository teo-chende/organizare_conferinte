const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Utilizator = require("./utilizator");                   // import entitatea utilizator din acelasi sub folder

const Conferinta = sequelize.define('Conferinta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titlu: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: true,
    },
    descriere: {
        type: DataTypes.STRING,
        allowNull: true
    },
    organizatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Utilizator,
            key: "id"
        }
    }
}, {
    tableName: "Conferinte",
    timestamps: false
});

module.exports = Conferinta;