import db from '../../../sequelize/models';
import { <%= upperName %>Attributes } from '../../../sequelize/models/<%= lowerName %>';

/**
 * Reusable attributes will go in here
 */

export function create (number?) {
    number = number ? number : 1;
    let promises = [];

    for (let i = 0; i < number; i++) {
        let promise = db.<%= lowerName %>.create(goodAttributes);
        promises.push(promise);
    }

    return Promise.all(promises);
}

/* yeo: attributes */

export const goodAttributes: <%= upperName %>Attributes = {

};

export const goodUpdateAttributes: <%= upperName %>Attributes = {

};

export const badAttributes: any = {

};
