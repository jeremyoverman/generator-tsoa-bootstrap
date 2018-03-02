import * as crypto from 'crypto';
import config from '../config';

/**
 * Generate a random string with the given length
 * 
 * @param length The length you want the generated string to be
 */
export function generateRandomString (length: number) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let string = '';

    for (let i = 0; i < length; i++) {
        string += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return string;
}

/**
 * Generate a hash given a secret and salt
 * 
 * @param secret The secret to generate the hash with. I.e., the plain text password
 * @param salt The salt to generate the hash with
 */
export function pbkdf2(secret: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(secret, salt, config.iterations, 64, 'sha512', (err, key) => {
            if (err) {
                reject(err);
            } else {
                resolve(key.toString('hex'));
            }
        });
    });
}