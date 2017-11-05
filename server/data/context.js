const logger = require('../libs/logger')('context');
const ApplicationError = require('../libs/application_error');

/**
 * Универсальный класс контекста
 * 
 * @class Context
 */
class Context {

    /**
     * Creates an instance of Context.
     * @param {Model} model 
     * @memberof Context
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Возвращает саму модель для доступа к low level функциям.
     * 
     * @returns {Model}
     * @memberof Context
     */
    self() {
        return this.model;
    }

    /**
     * Валидация модели и возврат статусов
     * 
     * @param {Object} data 
     * @memberof Context
     */
    validate(data) {
        const model = new this.model(data);

        return new Promise((resolve, reject) => {
            model.validate(validationResult => {
                if (!validationResult) resolve()
                else reject(validationResult.message);
            });
        });
    }

    /**
     * Возвращает данные из БД в [] 
     * 
     * @returns {[{"id":String}]} 
     * @memberof Context
     */
    async getAll() {
        const {userId} = this;
        try {
            const data = await this.model.find({
                userId
            });
            return data.map(item => item.toObject());
        } catch (err) {
            logger.error(`Loading data from ${this.model} failed `, err);
            throw new ApplicationError(`Loading data from ${this.model} failed, ${err}`, 500, false);
        }
    }

    /**
     * Добавление объекта в БД
     * 
     * @param {{Model}} item 
     * @returns {{Object}}
     * @memberof Context
     */
    async add(data) {
        try {
            const item = new this.model(data);
            await item.save();
            return item.toObject();
        } catch (err) {
            logger.error(`Storing data to ${this.model} failed `, err);
            throw new ApplicationError(`Storing data to ${this.model} failed, ${err}`, 500, false);
        }
    }
}

module.exports = Context;
