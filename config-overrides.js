const {injectBabelPlugin} = require('react-app-rewired');

/* config-overrides.js */
module.exports = function override(config, env) {
    return injectBabelPlugin('emotion', config);
};
