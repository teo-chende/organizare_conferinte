const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const Articol = require('./articol');
const Utilizator = require('./utilizator');

const Review = sequelize.define('Review', {
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
  reviewerId: {
    type: DataTypes.INTEGER,
    references: { model: Utilizator, key: 'id' },
    allowNull: false
  },
  decizie: {
    type: DataTypes.ENUM("acceptat", "revizuire", "respins"),
    allowNull: true // null până când reviewer-ul decide
  },
  comentarii: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("in_asteptare", "in_progres", "completat"),
    defaultValue: "in_asteptare"
  },
  dataReview: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "Reviews",
  timestamps: false
});

module.exports = Review;