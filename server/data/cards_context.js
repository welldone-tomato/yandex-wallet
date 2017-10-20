const Context = require('./context');
const Card = require('../models/card');

/**
 * Контекст работы с картами пользователя
 * 
 * @class CardsContext
 * @extends {Context}
 */
class CardsContext extends Context {

    /**
     * Creates an instance of CardsContext.
     * @memberof CardsContext
     */
    constructor() {
        super(Card);
    }

    // /**
    //  * Возвращает карту по номеру карты
    //  * 
    //  * @returns {Promise<Array>}
    //  * @memberof CardsContext
    //  */
    // async getByCardNumber(cardNumber) {
    //     const cards = await this.getAll();
    //     return cards.find(item => item.cardNumber === cardNumber);
    // }

    // /**
    //  * Изменяет баланс карты
    //  * 
    //  * @param {Number} id 
    //  * @param {Object} transaction 
    //  * @returns {Boolean}
    //  * @memberof CardsContext
    //  */
    // async affectBalance(id, transaction) {
    //     const card = await this.get(id);
    //     card.balance += Number(transaction.sum);

//     await this.edit(id, card);
// }
}

module.exports = CardsContext;
