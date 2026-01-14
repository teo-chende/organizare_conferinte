const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sqlite/database.db',
    // logging: console.log,  // Activează pentru a vedea query-urile SQL în consolă
    define: {
        timestamps: false
    }
});

module.exports = sequelize;