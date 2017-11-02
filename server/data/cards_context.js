const ObjectId = require('mongoose').Types.ObjectId;

const logger = require('../libs/logger')('cards-context');
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
    constructor(userId) {
        if (!userId)
            throw new ApplicationError('user id is required', 500);

        super(Card);

        this.userId = new ObjectId(userId);
    }

    /**
     * Возвращает элемент по id
     * 
     * @param {String} id 
     * @memberof Context
     */
    async get(id) {
        const data = await this.getModelById(id);
        return data ? data.toObject() : data;
    }

    /**
     * Возвращает элемент по id
     * 
     * @param {String} id 
     * @memberof Context
     */
    async getModelById(id) {
        const {userId} = this;

        try {
            return this.model.findOne({
                _id: new ObjectId(id),
                userId
            });

        } catch (err) {
            logger.error(`Loading data from ${this.model} failed `, err);
            throw new ApplicationError(`Loading data from ${this.model} failed, ${err}`, 500, false);
        }
    }

    /**
     * Удаление объекта
     * 
     * @param {String} id 
     * @returns {Promise}
     * @memberof Context
     */
    async remove(id) {
        const data = await this.getModelById(id);

        if (!data)
            throw new ApplicationError(`Item with id=${id} not found`, 404);

        await data.remove();
    }

    /**
     * Возвращает карту по номеру карты
     * 
     * @param {String} cardNumber 
     * @returns {Promise<Object>}
     * @memberof CardsContext
     */
    async getByCardNumber(cardNumber) {
        const {userId} = this;
        const data = await this.model.findOne({
            cardNumber,
            userId
        });
        return data ? data.toObject() : data;
    }

    /**
     * Изменяет баланс карты
     * 
     * @param {String} id 
     * @param {Object} transaction 
     * @returns {Promise}
     * @memberof CardsContext
     */
    async affectBalance(id, {sum}) {
        const card = await this.getModelById(id);

        if (!card)
            throw new ApplicationError(`Item with id=${id} not found`, 404);

        card.balance += sum;

        await card.save();
    }
}

module.exports = CardsContext;
