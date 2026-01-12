import Sequelize from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'backend/sqlite/database.db',
    // logging: console.log,                           // vezi interogările în consolă
    define: {
		timestamps: false
	}
});

export { sequelize };