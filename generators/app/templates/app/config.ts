let config = {
    iterations: 1000000,
    jwt_expire: '12h'
}

if (process.env.NODE_ENV === 'test') {
    config = Object.assign(config, {
        iterations: 1,
    });
}

export default config;