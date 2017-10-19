const fs = require('fs');
const util = require('util');

const cards = require('../cardsData');
const transactions = require('../transactionsData');

const writeFile = util.promisify(fs.writeFile);
const CARDS_FILE_NAME = '/../../db/cards.json';
const TRANSACTIONS_FILE_NAME = '/../../db/transactions.json'


/**
     * Восстанавливает базу данных в первоначальное состояние
     * 
     * @param {Function} done 
     */
const restoreDb = done => {
    Promise.all(
        [writeFile(__dirname + CARDS_FILE_NAME, JSON.stringify(cards)),
            writeFile(__dirname + TRANSACTIONS_FILE_NAME, JSON.stringify(transactions))]
    ).then(() => done());
}

module.exports = restoreDb;
