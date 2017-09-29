const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const ApplicationError = require('../libs/application_error');

/**
 * Универсальный класс контекста
 * 
 * @class Context
 */
class Context {

    /**
     * Creates an instance of Context.
     * @param {String} fileName 
     * @memberof Context
     */
    constructor(fileName) {
        this.fileName = fileName;
    }

    /**
     * Записывает данные объекта в файл
     * 
     * @param {any} data 
     * @memberof Context
     */
    async save(data) {
        await writeFile(__dirname + this.fileName, JSON.stringify(data));
    }

    /**
     * Читает данные из файла в объект 
     * 
     * @returns {[{"id":Number}]} 
     * @memberof Context
     */
    async getAll() {
        const data = await readFile(__dirname + this.fileName, 'utf8');
        return JSON.parse(data);
    }

    /**
     * Возвращает элемент по id
     * 
     * @param {String} id 
     * @memberof Context
     */
    async get(id) {
        const data = await this.getAll();
        return data.find(x => x.id === id);
    }

    /**
     * Получает следующий id из файла
     * 
     * @param {[]} data 
     * @returns {Integer}
     * @memberof Context
     */
    async getNextId(data) {
        data = data || await this.getAll();
        const ids = data.map(obj => obj.id);
        return Math.max(...ids) + 1;
    }

    /**
     * Добавление объекта в файл
     * 
     * @param {{Object}} item 
     * @returns {{Object}}
     * @memberof Context
     */
    async add(item) {
        const data = await this.getAll();
        item.id = await this.getNextId(data);
        data.push(item);

        await this.save(data);

        return item;
    }

    /**
     * Удаление объекта из файла
     * 
     * @param {String} id 
     * @returns {Boolean}
     * @memberof Context
     */
    async remove(id) {
        const item = await this.get(id);
        if (!item)
            throw new ApplicationError(`Item with id=${id} not found`, 404);

        let data = await this.getAll();
        data = data.filter(item => item.id !== id);

        await this.save(data);

        return true;
    }

    /**
     * Обновляет элемент в файле
     * 
     * @param {Integer} id 
     * @param {Object} item 
     * @memberof Context
     */
    async edit(id, item) {
        const items = await this.getAll();

        const itemIndex = items.findIndex(item => item.id === id);

        if (itemIndex === -1)
            throw new ApplicationError(`Item with id=${id} not found`, 404);

        items[itemIndex] = {
            ...items[itemIndex],
            item
        };

        this.save(items);
    }
}

module.exports = Context;
