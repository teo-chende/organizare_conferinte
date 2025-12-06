const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Utilizator = require("./utilizator");
const Conferinta = require("./conferinta")


// tabela articol stocheaza informatii generale despre articol
// articolul efectiv este stocat in versiune articol
const Articol = sequelize.define('Articol', {
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
        references: { model: Utilizator, key: 'id' },
        allowNull: false
    }
}, {
    tableName: "Articole",
    timestamps: false                               // dezactivează createdAt + updatedAt
});
module.exports = Articol;