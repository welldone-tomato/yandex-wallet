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

    /**
     * Добавляет транзакцию в систему
     * 
     * @param {Object} transaction 
     * @param {Object} cards Object
     * @returns {Boolean}
     * @memberof TransactionsContext
     */
    async addTransaction(transaction, cardsContext) {
        if (!transaction || !cardsContext)
            throw new ApplicationError(`missing context`, 500);

        let {cardId} = transaction;
        cardId = parseInt(cardId, 10);

        const card = await cardsContext.get(cardId);

        if (!card)
            throw new ApplicationError(`Card with id=${cardId} not found`, 400);

        await this.add({
            ...transaction,
            cardId
        });

        return true;
    }
}

module.exports = TransactionsContext;
