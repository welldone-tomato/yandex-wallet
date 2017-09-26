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
}

module.exports = CardsContext;
