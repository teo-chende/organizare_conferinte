const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Utilizator = require("./utilizator");                   // import entitatea utilizator din acelasi sub folder
const Conferinta = require("./conferinta");  

const ReviewerPeConferinta = sequelize.define("Reviewer_pe_conferinta", {});

module.exports = ReviewerPeConferinta;