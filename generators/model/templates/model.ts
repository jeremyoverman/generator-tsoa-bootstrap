import * as Sequelize from 'sequelize';

import { Instance, RawInstance } from '../model';
import { DAOModel } from './index';
import { <%= upperName %>DAO } from '../dao/<%= lowerName %>';

export interface <%= upperName %>Attributes {

}

export interface Raw<%= upperName %>Instance extends <%= upperName %>Attributes, RawInstance {

}

export interface <%= upperName %>Instance extends Raw<%= upperName %>Instance {

};

type TDAO = <%= upperName %>DAO<<%= upperName %>Instance, <%= upperName %>Attributes>;
export type T<%= upperName %>Model = DAOModel<<%= upperName %>Instance, <%= upperName %>Attributes, TDAO>;

export default function defineUser(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
    const <%= upperName %>: T<%= upperName %>Model = sequelize.define('<%= lowerName %>', {
    });

    <%= upperName %>.postCreate = function (db, model) {
        model.DAO = new <%= upperName %>DAO();

        return model;
    }

    return <%= upperName %>;
}