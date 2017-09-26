const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const FILE_NAME = '/./db/cards.json';

const CardsContext = {
    /**
     * Возвращает список карт со всеми данными в object
     * 
     * @returns {Promise<Object>}
     */
    async readCards() {
        let data = await readFile(__dirname + FILE_NAME, 'utf8');
        return JSON.parse(data);
    },

    /**
     * Возвращает массив только номеров карт, которые есть в файле
     * 
     * @returns {Promise<Array>}
     */
    async readCardsNumbers() {
        const cards = await this.readCards();
        return cards.map(item => item['cardNumber']);
    },

    /**
     * Записывает данные объекта в файл
     * 
     * @param {any} cards 
     */
    async writeCards(cards) {
        await writeFile(__dirname + FILE_NAME, JSON.stringify(cards));
    },

    /**
     * Получает следующий id из файла
     * 
     * @param {Array} cards 
     * @returns {Integer}
     */
    getNextId(cards) {
        const ids = cards.map(obj => obj.id);
        return Math.max(...ids) + 1;
    },

    /**
     * Ищет элемент в базе по id
     * 
     * @param {Integer} id 
     * @returns {Object}
     */
    async findById(id) {
        let cards = await this.readCards();
        return cards.find(x => x.id === id);
    }
}

module.exports = CardsContext;
