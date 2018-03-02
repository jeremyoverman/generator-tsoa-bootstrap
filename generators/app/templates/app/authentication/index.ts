import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as Debug from 'debug';

import db from '../sequelize/models'
import config from '../config';
import owners from './owner';

import * as errors from '../lib/errors';
import { IToken } from '../lib/jwt';

let debug = Debug('<%= name %>:auth');

function getDecodedToken (token) {
    if (!token) return null;

    let decoded_token = jwt.decode(token) as IToken;

    if (typeof decoded_token === 'string' || decoded_token === null) {
        return null;
    }

    return decoded_token;
}

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
    debug('Starting authentication process');

    const token = request.body.token || request.query.token || request.headers['x-token'];
    const decoded = getDecodedToken(token);

    if (!decoded) {
        debug('Unable to decode token');
        return Promise.reject(errors.NO_TOKEN);
    } else {
        debug('Token decoded: User:', decoded.user);
    }

    return new Promise((resolve, reject) => {
        /**
         * This should be replaced with a DAO call to get the user's secret.
         * Basic idea is you'll have a user model with a secret column on it
         * that's randomly generated each time a user is logged in. When the user
         * logs out, that secret is deleted from that user.
         * 
         * For example:
         * ```javascript
         * return db.user.DAO.getSecret(decoded.user).then(secret => {
         *     ...
         * });
         * ```
         * 
         * Where the `getSecret` method may look something like:
         * 
         * ```javascript
         * return db.user.findById(id).then(user => user.secret);
         * ```
         * 
         */
        resolve('your-secret');
    }).then((secret: string) => {
        debug('User secret: ' + secret);
        // This will throw an exception if it fails to verify the token
        jwt.verify(token, secret);

        debug('Token verified');

        if (securityName === 'token') {
            debug('Security Name: token');
            // Check if JWT contains all required scopes
            if (scopes) {
                debug('Scopes on controller:', scopes);
                if (!decoded.scopes) {
                    debug('No scopes found in token');
                    throw errors.NOT_IN_SCOPE;
                } else {
                    debug('Scopes on token:', scopes)
                }

                if (!scopes.every(scope => decoded.scopes.indexOf(scope) >= 0)) {
                    debug('Scopes missing in token');
                    throw errors.NOT_IN_SCOPE;
                }
            }
        } else if (securityName === 'owner') {
            debug('Security Name: owner');
            return Promise.all(scopes.map(scope => {
                let resource_id = request.params[scope + '_id'];
                let ownerFn = owners[scope];

                if (!ownerFn) throw errors.OWNER_SCOPE_DOESNT_EXIST;

                return ownerFn(resource_id, decoded.user);
            })).then(() => {
                debug('Authenitcation successful');
                return decoded;
            });
        } else {
            debug('Unknown Security Name:', securityName);
            throw errors.SECURITY_NAME_DOESNT_EXIST;
        }

        debug('Authentication successful');
        return decoded;
    });
};