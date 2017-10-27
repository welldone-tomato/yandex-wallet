const logger = require('../libs/logger')('context');
const ApplicationError = require('../libs/application_error');
const Context = require('./context');
const User = require('../models/user');

/**
 * Контекст работы с транзакциями пользователя
 * 
 * @class CardsContext
 * @extends {Context}
 */
class TransactionsContext extends Context {
    constructor() {
        super(User);
    }

    /**
     * Возвращает данные из БД в [] 
     * 
     * @returns {[{"id":String}]} 
     * @memberof Context
     */
    async getOne(conditions) {
        try {
            const data = await this.model.findOne(conditions);
            return data ? data.toObject() : data;
        } catch (err) {
            logger.error(`Loading data from ${this.model} failed `, err);
            throw new ApplicationError(`Loading data from ${this.model} failed, ${err}`, 500, false);
        }
    }
}

module.exports = TransactionsContext;
