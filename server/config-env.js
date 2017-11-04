/*** Define CONST */
const MONGO = process.env.NODE_MONGO || 'mongodb://localhost/wallet';
const JWT_SECRET = process.env.NODE_JWT_SECRET || 'jjskskKKKAjajenwfpaP';
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '411396184:AAHkCHvOAmkU7fjs7rFVOshYsKXyMKrulqY';

module.exports = {
    MONGO,
    JWT_SECRET,
    TELEGRAM_TOKEN
};
