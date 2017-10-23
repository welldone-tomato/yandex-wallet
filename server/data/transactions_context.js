const ObjectId = require('mongoose').Types.ObjectId;

const Context = require('./context');
const Transaction = require('../models/transaction');

/**
 * Контекст работы с транзакциями пользователя
 * 
 * @class CardsContext
 * @extends {Context}
 */
class TransactionsContext extends Context {
    constructor() {
        super(Transaction);
    }

    /**
     * Возращает массив транзакций по id карты пользователя
     * 
     * @param {String} id 
     * @returns []
     * @memberof TransactionsContext
     */
    async getByCardId(id) {
        const data = await this.model.find({
            cardId: new ObjectId(id)
        });
        return data.map(item => item.toObject());
    }

    /**
     * Возращает strean массив транзакций по id карты пользователя
     * 
     * @param {String} id 
     * @returns {Stream}
     * @memberof TransactionsContext
     */
    getByCardIdStream(id) {
        return this.model.find({
            cardId: new ObjectId(id)
        }).cursor();
    }
}

module.exports = TransactionsContext;
