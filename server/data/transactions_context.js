const Context = require('./context');
const Transaction = require('../models/transactions');

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

// /**
//  * Возращает массив транзакций по id карты пользователя
//  * 
//  * @param {any} id 
//  * @returns 
//  * @memberof TransactionsContext
//  */
// async getByCardId(id) {
//     const data = await this.getAll();
//     return data.filter(item => item.cardId === id);
// }
}

module.exports = TransactionsContext;
