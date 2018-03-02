import * as Sequelize from 'sequelize';
import db from '../models/index';
import { <%= upperName %>Instance, <%= upperName %>Attributes } from '../models/<%= lowerName %>';

import { DAO } from '../dao';

export class <%= upperName %>DAO<I, A> extends DAO {
}