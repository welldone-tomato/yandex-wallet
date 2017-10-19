const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const cleanDatabase = done => mongoose.connection.db.dropDatabase(done);

before(done => {
    mongoose.connect('mongodb://docker/test_yandex_wallet', {
        useMongoClient: true
    });

    mongoose.connection
        .once('open', () => done())
        .once('error', error => console.error('Error: ', error));
});

beforeEach(done => cleanDatabase(done));
after(done => cleanDatabase(done));
