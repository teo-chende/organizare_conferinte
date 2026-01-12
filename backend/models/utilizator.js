import { sequelize } from '../sequelize.js';
import { DataTypes } from 'sequelize';

import Rol from "./rol.js";                   // import entitatea rol din acelasi sub folder
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
        defaultValue: 3                             // rolul Autor implicit
    }
}, {
    tableName: "Utilizatori",
    timestamps: false                               // dezactivează createdAt + updatedAt
});

export default Utilizator;


/*

*/