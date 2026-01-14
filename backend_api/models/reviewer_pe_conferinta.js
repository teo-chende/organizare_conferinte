const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

// TabelMany-to-Many între Conferinta și Utilizator (revieweri)
const ReviewerPeConferinta = sequelize.define('ReviewerPeConferinta', {
    conferintaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "ReviewerPeConferinta",
    timestamps: false
});

module.exports = ReviewerPeConferinta;