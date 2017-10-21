const Context = require('./context');
const Card = require('../models/card');

const ApplicationError = require('../libs/application_error');

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

    /**
     * Возвращает карту по номеру карты
     * 
     * @param {String} cardNumber 
     * @returns {Promise<Object>}
     * @memberof CardsContext
     */
    async getByCardNumber(cardNumber) {
        const card = await this.model.findOne({
            cardNumber
        });
        return card.toObject();
    }

    /**
     * Изменяет баланс карты
     * 
     * @param {String} id 
     * @param {Object} transaction 
     * @returns {Promise}
     * @memberof CardsContext
     */
    async affectBalance(id, transaction) {
        const card = await this.model.findById(id);

        if (!card)
            throw new ApplicationError(`Item with id=${id} not found`, 404);

        card.balance += transaction.sum;

        await card.save();
    }
}

module.exports = CardsContext;
