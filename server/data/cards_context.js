const Context = require('./context');

const FILE_NAME = '/../db/cards.json';

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
        super(FILE_NAME);
    }

    /**
     * Возвращает массив только номеров карт, которые есть в файле
     * 
     * @returns {Promise<Array>}
     * @memberof CardsContext
     */
    async getCardsNumbers() {
        const cards = await this.getAll();
        return cards.map(item => item['cardNumber']);
    }

    /**
     * Проверяет есть ли уже карта в базе
     * 
     * @param {any} cardNumber 
     * @returns {Boolean}
     * @memberof CardsContext
     */
    async checkCardExist(cardNumber) {
        const cardsNumbers = await this.getCardsNumbers();
        return cardsNumbers.includes(cardNumber);
    }

    /**
     * Возвращает карту по номеру карты
     * 
     * @returns {Promise<Array>}
     * @memberof CardsContext
     */
    async getByCardNumber(cardNumber) {
        const cards = await this.getAll();
        return cards.find(item => item.cardNumber === cardNumber);
    }

    /**
     * Изменяет баланс карты
     * 
     * @param {Number} id 
     * @param {Object} transaction 
     * @returns {Boolean}
     * @memberof CardsContext
     */
    async affectBalance(id, transaction) {
        const card = await this.get(id);
        card.balance += Number(transaction.sum);

        await this.edit(id, card);
    }
}

module.exports = CardsContext;
