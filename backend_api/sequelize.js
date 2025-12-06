const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sqlite/database.db',
    // logging: console.log,                           // vezi interogările în consolă
    define: {
		timestamps: false
	}
});

module.exports = sequelize;