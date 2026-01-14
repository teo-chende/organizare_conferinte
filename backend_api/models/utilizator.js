const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const Rol = require("./rol");

const Utilizator = sequelize.define('Utilizator', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 30]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Rol,
            key: "id"
        },
        defaultValue: 3  // Autor implicit
    }
}, {
    tableName: "Utilizatori",
    timestamps: false
});

module.exports = Utilizator;