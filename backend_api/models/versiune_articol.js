const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const Articol = require("./articol");

// Fiecare articol poate avea mai multe versiuni (PDF-uri)
const VersiuneArticol = sequelize.define('VersiuneArticol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    articolId: {
        type: DataTypes.INTEGER,
        references: { 
            model: Articol, 
            key: 'id' 
        },
        allowNull: false
    },
    nrVersiune: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    document: {
        type: DataTypes.BLOB('long'),  // Salvează fișierul în format binar
        allowNull: false
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dataIncarcare: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    comentariiAutor: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "VersiuneArticole",
    timestamps: false
});

module.exports = VersiuneArticol;