/**
 * Global configurations can go in here
 */
let config = {
    iterations: 1000000,
    jwt_expire: '12h'
}

/**
 * Based on different environments, change the config up.
 */
if (process.env.NODE_ENV === 'test') {
    Object.assign(config, {
        iterations: 1,
    });
}

export default config;