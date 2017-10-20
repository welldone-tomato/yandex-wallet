const ObjectId = require('mongoose').Types.ObjectId;

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
     * Валидация модели и возврат статусов
     * 
     * @param {any} data 
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
        try {
            const data = await this.model.find({});
            return data.map(item => item.toObject());
        } catch (err) {
            logger.error(`Loading data from ${this.model} failed `, err);
            throw new ApplicationError(`Loading data from ${this.model} failed, ${err}`, 500, false);
        }
    }

    /**
     * Возвращает элемент по id
     * 
     * @param {String} id 
     * @memberof Context
     */
    async get(id) {
        try {
            const data = await this.model.findById(id);

            return data ? data.toObject() : data;
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

    /**
     * Удаление объекта из файла
     * 
     * @param {String} id 
     * @returns {Boolean}
     * @memberof Context
     */
    async remove(id) {
        const item = await this.model.findById(id);
        if (!item)
            throw new ApplicationError(`Item with id=${id} not found`, 404);

        await item.remove();
    }

    // /**
    //  * Обновляет элемент в файле
    //  * 
    //  * @param {Integer} id 
    //  * @param {Object} item 
    //  * @return {Boolean}
    //  * @memberof Context
    //  */
    // async edit(id, item) {
    //     const items = await this.getAll();

    //     const itemIndex = items.findIndex(item => item.id === id);

    //     if (itemIndex === -1)
    //         throw new ApplicationError(`Item with id=${id} not found`, 404);

    //     items[itemIndex] = item;

//     await this.save(items);
// }
}

module.exports = Context;
