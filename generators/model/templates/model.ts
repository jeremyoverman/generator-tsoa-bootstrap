import * as Sequelize from 'sequelize';

import { Instance, RawInstance } from '../model';
import { DAOModel } from './index';
import { <%= upperName %>DAO } from '../dao/<%= lowerName %>';
import { DbConnection } from '../dbConnection';

/* The attributes of the model. Does not include id. */
export interface <%= upperName %>Attributes {
    /**
     * Do not edit the attributes between yeo-replace. They will be added by automation.
     */

    /* yeo-replace: attributes */

    /* yeo-end */
}

/* This should include things an instance of the model will have, but without
 * using sequelize methods. For instance, if an instance of your model has an array
 * of another model instance, you wouldn't do `OtherModelInstance[]`, you'd do
 * `OtherModelRawInstance[]`. This is because TSOA is unable to correctly type the
 * sequelize methods that are attached to an instance.
 */
export interface Raw<%= upperName %>Instance extends <%= upperName %>Attributes, RawInstance {

}

/* This is where you'll include the real sequelize instance stuff. */
export interface <%= upperName %>Instance extends Sequelize.Instance<<%= upperName %>Attributes>, Raw<%= upperName %>Instance {

};

/* This type will be added to DbConnection for you. You should be able to access
 * this model using something like:
 * 
 * ```javascript
 * import db from '../models';
 * 
 * db.<%= upperName %>.create(...);
 * db.<%= upperName %>.DAO.yourMethod(...);
 * etc.
 * ```
 */
type TDAO = <%= upperName %>DAO<<%= upperName %>Instance, <%= upperName %>Attributes>;
export type T<%= upperName %>Model = DAOModel<<%= upperName %>Instance, <%= upperName %>Attributes, TDAO>;
 

/**
 * This method will be called when the app is being initialized automatcially for
 * you. The first thing you'll do in here is define what you want your model to
 * look like. See http://docs.sequelizejs.com/manual/tutorial/models-definition.html
 * for more information there.
 * 
 * The second thing you'll do in the `postCreate` method is define anything that
 * needs to happen once all models are created. This will be things like adding
 * the DAO to the model, adding associations, etc.
 * 
 * @param sequelize The sequelize instance
 * @param DataTypes The DataTypes
 */
export default function defineUser(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    const <%= upperName %>: T<%= upperName %>Model = sequelize.define('<%= lowerName %>', Object.assign<Sequelize.DefineAttributes, Sequelize.DefineAttributes>({
        /* Do not change anything in here. Automation will fill this out for you, anything that
         * needs to be overwritten should be added to the next object being assigned to this object
         */

        /* yeo-replace: definitions */

        /* yeo-end */
    }, {
        /* Overwrite model attributes here */
    }));

    <%= upperName %>.postCreate = function (db: DbConnection, model: T<%= upperName %>Model) {
        model.DAO = new <%= upperName %>DAO();
        
        /* Add your associations here */

        return model;
    }

    return <%= upperName %>;
}