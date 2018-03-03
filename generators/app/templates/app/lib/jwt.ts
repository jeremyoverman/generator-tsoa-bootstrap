import * as jwt from 'jsonwebtoken';
import db from '../sequelize/models';
import config from '../config';

export interface IToken {
    user: number;
    scopes?: string[];
}

/**
 * Get the user id from the given token _without_ verifying the token
 * 
 * @param token The JWT token
 */
export function getUserFromToken(token: string) {
    let decoded = jwt.decode(token) as IToken;

    if (decoded === null) {
        return null;
    }

    return decoded.user;
}

/**
 * Create a new token for the given user id.
 * 
 * @param userid The user id to create the token for
 */
export function createToken(userid) {
    // return db.user.DAO.generateSecret(userid).then(secret => {
    return new Promise((resolve, reject) => {
        /**
         * This promise should be called to a user DAO that generates a secret
         * for the user. See the comments in `authentication.ts` for more
         * information.
         */
        resolve('my-secret');
    }).then((secret: string) => {
        return jwt.sign({ user: userid }, secret, {
            expiresIn: config.jwt_expire
        });
    })
}