import * as supertest from 'supertest';
import * as setup from '../support/setup';

import db from '../../sequelize/models';
import app from '../../app';

describe('In the <%= lowerName %> controller', () => {
    setup.sequelize();
});