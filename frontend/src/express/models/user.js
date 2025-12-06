import { DataTypes } from 'sequelize';
console.log("modul models/user")

import { myORM } from "../sqlite.js"
         
/*
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 10]
        }
    }
});

module.exports = User;
*/