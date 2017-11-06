const Context = require('./context');
const User = require('../models/user');

const ApplicationError = require('../libs/application_error');
const logger = require('../libs/logger')('user-context');

/**
 * Контекст работы с пользователями
 * 
 * @class UsersContext
 * @extends {Context}
 */
class UsersContext extends Context {
    constructor() {
        super(User);
    }

    /**
     * Добавляет новое поле к объекту пользователя в БД
     * 
     * @param {{Object}} conditions условия для поиска
     * @param {{String}} field добавляемое поле
     * @param {{String}} value значение нового поля
     * @returns {{Object}} сохранённый объект
     * @memberof Context
     */
    async addField(conditions, field, value) {
        try {
            const data = await this.model.findOne(conditions);
            data[field] = value;
            await data.save();
            return data.toObject();
        } catch (err) {
            logger.error(`Updating ${this.model} failed: `, err);
            throw new ApplicationError(`Updating ${this.model} failed, ${err}`, 500, false);
        }
    }
}

module.exports = UsersContext;
