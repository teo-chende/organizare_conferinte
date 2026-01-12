//const sequelize = require('../sequelize');
//const { DataTypes } = require('sequelize');

import { sequelize } from '../sequelize.js'
import { DataTypes } from 'sequelize'

const Rol = sequelize.define('Rol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false,
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

export default Rol;

