import { sequelize } from '../sequelize.js';
import { DataTypes } from 'sequelize';

import Articol from "./articol.js";
import { version } from 'os';

const VersiuneArticol = sequelize.define('VersiuneArticol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    articolId: {
        type: DataTypes.INTEGER,
        references: { model: Articol, key: 'id' },
        allowNull: false
    },
    nrVersiune: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    document: {
        type: DataTypes.BLOB('long'),               // salvez documentul in binar cu fisier BLOB
        allowNull: false
    },
    mimeType: {
        type: DataTypes.STRING, 
        //allowNull: false
    },
    dataIncarcare: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    comentariiAutor: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "VersiuneArticole",
    timestamps: false                               // dezactivează createdAt + updatedAt
});

export default VersiuneArticol;