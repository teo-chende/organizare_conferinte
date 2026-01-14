const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Rol = sequelize.define('Rol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    descriere: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "Roluri",
    timestamps: false
});

module.exports = Rol;