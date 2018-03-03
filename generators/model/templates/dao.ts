import * as Sequelize from 'sequelize';
import db from '../models/index';
import { <%= upperName %>Instance, <%= upperName %>Attributes } from '../models/<%= lowerName %>';

import { DAO } from '../dao';

export class <%= upperName %>DAO<I, A> extends DAO {
    /**
     * Data Access Objects
     * 
     * Add any methods for talking to your model here. Note that this extends a parent
     * DAO class that, by default, doesn't do much. You can add common functionality
     * between all DAO's to that parent class for DRYness.
     * 
     * By default, this will get attached to your model with the DAO property.
     */
}