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

const namespace = cls.createNamespace('<%= name %>');

Sequelize.useCLS(namespace);

const dbConfig = config[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize( dbConfig['database'], dbConfig['username'], dbConfig['password'], Object.assign(dbConfig, {
    logging: msg => {
        debug(msg);
    }
}));

const basename = path.basename(module.filename);

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model['name']] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].postCreate) {
        db[modelName] = db[modelName].postCreate(<DbConnection>db, db[modelName]);
    }
});

db['sequelize'] = sequelize;

export default <DbConnection>db;