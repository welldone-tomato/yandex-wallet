const Context = require('./context');

const ApplicationError = require('../libs/application_error');

const FILE_NAME = '/../db/transactions.json';

/**
 * Контекст работы с транзакциями пользователя
 * 
 * @class CardsContext
 * @extends {Context}
 */
class TransactionsContext extends Context {
    constructor() {
        super(FILE_NAME);
    }

    /**
     * Возращает массив транзакций по id карты пользователя
     * 
     * @param {any} id 
     * @returns 
     * @memberof TransactionsContext
     */
    async getByCardId(id) {
        if (typeof id === 'string' || id instanceof String)
            id = parseInt(id, 10);

        const data = await this.getAll();
        return data.filter(item => item.cardId === id);
    }
}

module.exports = TransactionsContext;
