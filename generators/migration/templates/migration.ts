import { QueryInterface, SequelizeStatic } from 'sequelize';

/**
 * Define the actions you want to take on the database in this file. Any methods
 * in "up" will be run when you commit your migration, and anything in down will
 * be performed when you roll back your migration.
 * 
 * Run `npm run sequelize:migrate` to run pending migrations.
 * Run `npm run sequelize:migrate:undo` to undo the last migration
 * 
 * In testing, all migrations will be run before every test, and all tables will
 * be dropped. This is all done in a memory sqlite database.
 * 
 * See http://docs.sequelizejs.com/manual/tutorial/migrations.html for more
 * details.
 */

module.exports = {
    up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        // Return Promise
    },

    down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        // Return Promise
    }
};