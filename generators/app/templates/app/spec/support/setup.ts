import db from '../../sequelize/models/index';
import * as Sequelize from 'sequelize';
import * as Umzug from 'umzug';
import { join } from 'path';

let umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: db.sequelize
    },
    migrations: {
        params: [
            db.sequelize.getQueryInterface(),
            Sequelize
        ],
        path: join(__dirname, '..', '..', 'sequelize', 'migrations')
    }
});

/**
 * Before each test, run all of the migrations. After each test, undo all migrations.
 */
export function sequelize() {
    beforeEach(() => umzug.up());
    afterEach(() => umzug.down({to: 0}));
}