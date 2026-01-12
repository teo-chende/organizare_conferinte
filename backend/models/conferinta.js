import { sequelize } from '../sequelize.js';
import { DataTypes } from 'sequelize';

import Utilizator from "./utilizator.js";                   // import entitatea utilizator din acelasi sub folder

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

export default Conferinta;