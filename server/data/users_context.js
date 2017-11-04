const logger = require('../libs/logger')('context');
const ApplicationError = require('../libs/application_error');
const Context = require('./context');
const User = require('../models/user');

/**
 * Контекст работы с пользователями
 * 
 * @class CardsContext
 * @extends {Context}
 */
class UsersContext extends Context {
    constructor() {
        super(User);
    }

}

module.exports = UsersContext;
