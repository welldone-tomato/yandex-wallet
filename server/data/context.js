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
        let data = await readFile(__dirname + this.fileName, 'utf8');
        return JSON.parse(data);
    }

    /**
     * Возвращает элемент по id
     * 
     * @param {any} id 
     * @memberof Context
     */
    async get(id) {
        id = parseInt(id, 10);
        const data = await this.getAll();
        return data.find(x => x.id === id);
    }

    /**
     * Получает следующий id из файла
     * 
     * @param {Array} cards 
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
     * @param {{}} item 
     * @returns {{}}
     * @memberof Context
     */
    async add(item) {
        const data = await this.getAll();
        item.id = await this.getNextId(data);
        data.push(item);

        await this.save(data);

        return item;
    }

    async remove(id) {
        id = parseInt(id, 10);
        const item = await this.get(id);
        if (!item)
            throw new ApplicationError(`Item with id=${id} not found`, 404);

        let data = await this.getAll();
        data = data.filter(item => item.id !== id);

        await this.save(data);
    }
}

module.exports = Context;
