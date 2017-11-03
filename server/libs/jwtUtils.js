const url = require('url');
const jwt = require('jwt-simple');
const { JWT_SECRET } = require('../config-env');
const logger = require('./logger')('jwt-utils');

/**
 * Verifies and decodes query JWT token, returns payload on success, or false on error
 * @param {Object} req
 * @returns {Object|Boolean}
 * @private
 */
const decodeJwtFromQuery = (req) => {
  const { JWT } = url.parse(req.url, true).query;
  try {
    return jwt.decode(JWT, JWT_SECRET);
  } catch (err) {
    logger.error(`JWT decode error: ${err.message}; url: ${req.url}`);
    return false;
  }
};

module.exports = {
  decodeJwtFromQuery,
};
