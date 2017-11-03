const ObjectId = require('mongoose').Types.ObjectId;

const {DOMAIN} = require('../config-env');

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

    /**
     * Возвращает данные из БД в [] 
     * 
     * @returns {[{"id":String}]} 
     * @memberof Context
     */
    async getAll() {
        const data = await super.getAll();

        return data.map(item => ({
            ...item,
            url: `http://${DOMAIN}/payme/${item.hash}`
        }));
    }
}

module.exports = MoneyRequestContext;
