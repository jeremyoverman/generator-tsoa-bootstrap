import * as Sequelize from 'sequelize';

/**
 * Import the models here. Do not delete any of the comments beginning with yeo.
 * These are here to help the yeoman generator know where to stick the template
 * pieces.
 * 
 * import { TMyModel } from './models/myModel.ts';
 */

/* yeo: import */

/**
 * Add the model here
 * 
 * myModel: TMyModel
 */
export interface DbConnection {
    /* yeo: type */
    sequelize: Sequelize.Sequelize;
}