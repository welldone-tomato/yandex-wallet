const path = require('path');
const log4js = require('log4js');

let level;

switch (process.env.NODE_ENV) {
    case 'dev':
        level = 'debug';
        break;

    case 'test':
        level = 'off';
        break;

    default:
        level = 'info';
}

const filename = path.resolve(__dirname, '..', 'logs', 'app.log');
const config = {
    appenders: {
        out: {
            type: 'stdout'
        },
        app: {
            type: 'file',
            filename,
            maxLogSize: 10485760
        }
    },
    categories: {
        default: {
            appenders: ['out', 'app'],
            level
        }
    }
};

log4js.configure(config);

module.exports = category => log4js.getLogger(category);
