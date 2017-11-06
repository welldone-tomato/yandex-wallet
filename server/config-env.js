/*** Define CONST */
// const MONGO = process.env.NODE_MONGO || 'mongodb://docker/test_yandex_wallet';
const MONGO = process.env.NODE_MONGO || 'mongodb://localhost:27017/test_wallet';
const JWT_SECRET = process.env.NODE_JWT_SECRET || 'jjskskKKKAjajenwfpaP';
const DOMAIN = process.env.NODE_DOMAIN || 'wallet.kroniak.net';
const PORT = process.env.NODE_PORT || 4000;
const HOST = ['test', 'dev'].includes(process.env.NODE_ENV) ? 'localhost:' + PORT : DOMAIN;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '490448650:AAGSVT8ltGOasRSCyTeQ4g0gzMlaW0umqhk';

module.exports = {
    MONGO,
    JWT_SECRET,
    HOST,
    PORT,
    DOMAIN,
    TELEGRAM_TOKEN
};
