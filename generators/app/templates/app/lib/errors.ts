/**
 * You can declare all of your errors in here. This makes it easier to to compare
 * errors between your DAO and your controller and will make the transition to
 * i18n translations easier in the future.
 */

export const LOGIN_INCORRECT = new Error('Username and/or password is incorrect');
export const USER_EXISTS = new Error('This username already exists');
export const NO_TOKEN = new Error('No token provided');
export const NOT_IN_SCOPE = new Error('Token does not contain required scope.');
export const NOT_OWNER = new Error('You are not the owner of this resource.')
export const SECURITY_NAME_DOESNT_EXIST = new Error('The security name provided does not exist');
export const OWNER_SCOPE_DOESNT_EXIST = new Error('The owner scope does not exist');
export const NOT_FOUND = new Error('This resource was not found');