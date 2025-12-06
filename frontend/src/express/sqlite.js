import { Sequelize } from 'sequelize';

export const myORM = new Sequelize('sqlite::memory:');

//export myORM;