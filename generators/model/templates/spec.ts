import db from '../../sequelize/models/index';
import * as setup from '../support/setup';

import { <%= upperName %>Instance, <%= upperName %>Attributes } from '../../sequelize/models/<%= lowerName %>';

let dao = db.<%= lowerName %>.DAO;

describe('In the <%= upperName %> DAO', () => {
})