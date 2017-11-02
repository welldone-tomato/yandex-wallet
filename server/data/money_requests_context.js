const ObjectId = require('mongoose').Types.ObjectId;

const ApplicationError = require('../libs/application_error');
const Context = require('./context');
const MoneyRequest = require('../models/money_request');

/**
 * Контекст работы с пользователями
 * 
 * @class CardsContext
 * @extends {Context}
 */
class MoneyRequestContext extends Context {
    constructor(userId) {
        if (!userId)
            throw new ApplicationError('user id is required', 500);

        super(MoneyRequest);

        this.userId = new ObjectId(userId);
    }
}

module.exports = MoneyRequestContext;
