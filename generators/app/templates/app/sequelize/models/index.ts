import * as Sequelize from 'sequelize'
import * as fs from 'fs'
import * as path from 'path'
import * as cls from 'continuation-local-storage';
import config from '../config/config'
import { DbConnection } from '../dbConnection';

import * as Debug from 'debug';

import { DAO } from '../dao';

let debug = Debug('<%= name %>:sql');

/**
 * Everything under here is defining the inner workings of initializing the
 * sequelize models. Normally there's no need to edit anything under here.
 */

export interface DAOModel<I,A,D extends DAO> extends Sequelize.Model<I,A> {
    DAO?: D;
    postCreate?: Function;
}

let db = {};

/**
 * Declare a global namespace for Sequelize. This lets you make transactions
 * without having to keep track of them and pass them to subsequent calls.
 */
const namespace = cls.createNamespace('<%= name %>');
Sequelize.useCLS(namespace);

/**
 * Create a sequelize instance using the config in `/sequelize/config/config.ts`
 * 
 * Logging by default is done using the debug module. To see all sequelize SQL
 * commands, run:
 * 
 * ```bash
 * SET DEBUG=<%= name %>:sql
 * ```
 */
const dbConfig = config[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize( dbConfig['database'], dbConfig['username'], dbConfig['password'], Object.assign(dbConfig, {
    logging: msg => {
        debug(msg);
    }
}));

/**
 * Import and initialize all models defined in `/sequelize/models`. This adds them
 * to the default export of this module. Typings are added in `/sequelize/dbConnection.ts`.
 */
const basename = path.basename(module.filename);
fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model['name']] = model;
    });

/**
 * Once all the models are initialized, go back through all of them and run their
 * `postCreate` methods if they have them. This let's us run methods that require
 * all models to be created such as associations.
 */
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].postCreate) {
        db[modelName] = db[modelName].postCreate(<DbConnection>db, db[modelName]);
    }
});

/**
 * Add the sequelize instance to the default export.
 */
db['sequelize'] = sequelize;

export default <DbConnection>db;