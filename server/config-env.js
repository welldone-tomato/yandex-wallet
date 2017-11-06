/*** Define CONST */
const MONGO = process.env.NODE_MONGO || 'mongodb://docker/wallet';
const JWT_SECRET = process.env.NODE_JWT_SECRET || 'jjskskKKKAjajenwfpaP';
const DOMAIN = process.env.NODE_DOMAIN || 'wallet.kroniak.net';
const PORT = process.env.NODE_PORT || 4000;
const HOST = ['test', 'dev'].includes(process.env.NODE_ENV) ? 'localhost:' + PORT : DOMAIN;

module.exports = {
    MONGO,
    JWT_SECRET,
    HOST,
    PORT,
    DOMAIN
};
