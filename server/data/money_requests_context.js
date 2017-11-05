const ObjectId = require('mongoose').Types.ObjectId;

const {DOMAIN} = require('../config-env');

const ApplicationError = require('../libs/application_error');
const Context = require('./context');
const MoneyRequest = require('../models/money_request');
const User = require('../models/user');
const Card = require('../models/card');

/**
 * Контекст работы с пользователями
 * 
 * @class CardsContext
 * @extends {Context}
 */
class MoneyRequestContext extends Context {
    constructor(userId) {
        if (!userId)
            throw new ApplicationError('user id is required', 500);

        super(MoneyRequest);

        this.userId = new ObjectId(userId);
    }

    /**
     * Возвращает данные из БД в [] 
     * 
     * @returns {[{"id":String}]} 
     * @memberof MoneyRequestContext
     */
    async getAll() {
        const data = await super.getAll();

        return data.map(item => ({
            ...item,
            url: `http://${DOMAIN}/payme/${item.guid}`
        }));
    }

    /**
     * Возращает money request по guid
     * 
     * @param {String} guid 
     * @returns {Object}
     * @memberof MoneyRequestContext
     */
    async getCardByGUIDInternal(guid) {
        const mr = await this.model.findOne({
            guid
        });

        if (!mr)
            throw new ApplicationError(`Money requests with guid=${guid} not found`, 404);

        const card = await Card.findById(mr.cardId);

        return card.toObject();
    }

    /**
     * Возращает money request по guid
     * 
     * @param {String} guid 
     * @returns {Object}
     * @memberof MoneyRequestContext
     */
    async getByGUID(guid) {
        const formatCardNumber = number => number.substr(0, 4) + '********' + number.substr(12, 15);

        const mr = await this.model.findOne({
            guid
        });

        if (!mr)
            throw new ApplicationError(`Money requests with guid=${guid} not found`, 404);

        const user = await User.findById(mr.userId);
        const card = await Card.findById(mr.cardId);

        if (!user || !card)
            throw new ApplicationError(`Money requests params is invalid`, 400);

        return {
            userName: user.email,
            cardNumber: formatCardNumber(card.cardNumber),
            sum: mr.sum,
            goal: mr.goal
        }
    }
}

module.exports = MoneyRequestContext;
