/*** Define CONST */
const MONGO = process.env.NODE_MONGO || 'mongodb://docker/test_yandex_wallet';
const JWT_SECRET = process.env.NODE_JWT_SECRET || 'jjskskKKKAjajenwfpaP';

module.exports = {
    MONGO,
    JWT_SECRET
};
