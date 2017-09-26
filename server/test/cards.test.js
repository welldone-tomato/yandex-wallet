process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Cards', () => {
    /**
     * Восстанавливает базу данных в первоначальное состояние
     * 
     * @param {Function} done 
     */
    function restoreCards(done) {
        const cards = [
            {
                "id": 0,
                "cardNumber": "5106216010173049",
                "balance": 15000
            },
            {
                "id": 1,
                "cardNumber": "5106216010126757",
                "balance": 700
            }
        ];

        fs.writeFile(__dirname + '/../db/cards.json', JSON.stringify(cards), err => {
            if (err)
                throw err;
            else done();
        });
    }

    before(done => restoreCards(done));

    describe('/GET cards', () => {
        it('it should GET all the cards in db', done => {
            chai.request(server)
                .get('/cards')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
    });

    describe('/POST new card', () => {
        it('it should not POST new card with empty body', done => {
            chai.request(server)
                .post('/cards')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not POST new card with empty cardNumber', done => {
            chai.request(server)
                .post('/cards')
                .send({
                    cardNumber: ''
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not POST new card with non valid cardNumber', done => {
            chai.request(server)
                .post('/cards')
                .send({
                    cardNumber: '15133306216010173046'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not POST new card with existing cardNumber', done => {
            chai.request(server)
                .post('/cards')
                .send({
                    cardNumber: '5106216010173049'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should POST new card', done => {
            after(done => restoreCards(done));

            chai.request(server)
                .post('/cards')
                .send({
                    cardNumber: '5483874041820682'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('cardNumber').eql('5483874041820682');
                    res.body.should.have.property('cardType').eql('mastercard');
                    done();
                });
        });
    });

    describe('/DELETE card', () => {
        it('it should not DELETE card with not real id', done => {
            chai.request(server)
                .delete('/cards/3')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should DELETE card with real id', done => {
            after(done => restoreCards(done));

            chai.request(server)
                .delete('/cards/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});