const Context = require('./context');

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
        const data = await this.getAll();
        return data.filter(item => item.cardId === parseInt(id, 10));
    }
}

module.exports = TransactionsContext;
