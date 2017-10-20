const mongoose = require('mongoose');
const async = require('async');

const Card = require('../models/card');
const cardsJson = require('./cards_data');

// const transactions = require('../transactionsData');
mongoose.Promise = global.Promise;

const cleanDatabase = () => mongoose.connection.db.dropDatabase();

const restoreDatabase = done => {
    cleanDatabase().then(() => {
        const cards = cardsJson.map(card => new Card(card));
        async.eachSeries(cards, (card, done) => card.save(done), err => {
            if (err) return done(err);
            done();
        });
    })
};

before(done => {
    mongoose.connect('mongodb://docker/test_yandex_wallet', {
        useMongoClient: true
    });

    mongoose.connection
        .once('open', () => done())
        .once('error', error => console.error('Error: ', error));
});

beforeEach(done => restoreDatabase(done));
after(done => restoreDatabase(done));
