const mongoose = require('mongoose');

const Card = require('../models/card');
const Transaction = require('../models/transaction');
const cardsJson = require('./data_cards');
const transactionsJson = require('./data_transactions');

mongoose.Promise = global.Promise;
process.env.NODE_ENV = 'test';

const cleanDatabase = () => mongoose.connection.db.dropDatabase();

const restoreDatabase = done => {
    cleanDatabase().then(() => {
        const cards = cardsJson.map(item => new Card(item));
        const transactions = transactionsJson.map(item => new Transaction(item));

        Promise.all(cards.map(item => item.save()))
            .then(results => Promise.all(transactions.map(item => item.save())))
            .then(results => done())
            .catch(err => done(err));
    })
};

before(done => {
    mongoose.connect('mongodb://docker/test_yandex_wallet', {
        useMongoClient: true,
        config: {
            autoIndex: false
        }
    });

    mongoose.connection
        .once('open', () => done())
        .once('error', error => console.error('Error: ', error));
});

beforeEach(done => restoreDatabase(done));
after(done => restoreDatabase(done));
