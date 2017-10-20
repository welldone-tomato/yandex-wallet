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
     * Возвращает данные из БД в [] 
     * 
     * @returns {[{"id":String}]} 
     * @memberof Context
     */
    async getAll() {
        try {
            const result = await this.model.find({});
            return result.map(item => item.toObject());
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
            const item = await this.model.findOne({
                _id: new ObjectId(id)
            });

            return item ? item.toObject() : item;
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
    async add(item) {
        try {
            await item.save();
            return item.toObject();
        } catch (err) {
            logger.error(`Storing data to ${this.model} failed `, err);
            throw new ApplicationError(`Storing data to ${this.model} failed, ${err}`, 500, false);
        }
    }

    // /**
    //  * Удаление объекта из файла
    //  * 
    //  * @param {String} id 
    //  * @returns {Boolean}
    //  * @memberof Context
    //  */
    // async remove(id) {
    //     const item = await this.get(id);
    //     if (!item)
    //         throw new ApplicationError(`Item with id=${id} not found`, 404);

    //     const data = await this.getAll();

    //     await this.save(data.filter(item => item.id !== id));
    // }

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
