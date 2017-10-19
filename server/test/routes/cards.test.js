process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const restoreDb = require('./common');

const should = chai.should();
chai.use(chaiHttp);

describe('Cards', () => {
    beforeEach(done => restoreDb(done));

    after(done => restoreDb(done));

    describe('/GET cards', () => {
        it('it should GET all the cards in db', done => {
            chai.request(server)
                .get('/cards')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(5);
                    res.body[0].should.have.property('id').eql(1);
                    res.body[0].should.have.property('cardNumber').eql('546925000000000');
                    res.body[0].should.have.property('exp').eql('04/18');
                    res.body[0].should.have.property('balance').eql(15000);
                    res.body[0].should.have.property('name').eql('ALYSSA LIVINGSTON');
                    done();
                });
        });

        it('it should GET card from db with id', done => {
            chai.request(server)
                .get('/cards/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('cardNumber').eql('546925000000000');
                    res.body.should.have.property('exp').eql('04/18');
                    res.body.should.have.property('balance').eql(15000);
                    res.body.should.have.property('name').eql('ALYSSA LIVINGSTON');
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
                    cardNumber: '15133306216010173046',
                    exp: '04/18',
                    name: 'ALYSSA LIVINGSTON',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not POST new card with non valid exp date', done => {
            chai.request(server)
                .post('/cards')
                .send({
                    cardNumber: '5483874041820682',
                    exp: '01/10',
                    name: 'ALYSSA LIVINGSTON',
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
                    cardNumber: '546925000000000',
                    exp: '04/18',
                    name: 'ALYSSA LIVINGSTON',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should POST new card with balance', done => {
            chai.request(server)
                .post('/cards')
                .send({
                    cardNumber: '5483874041820682',
                    exp: '04/18',
                    name: 'ALYSSA LIVINGSTON',
                    balance: 10000
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('cardNumber').eql('5483874041820682');
                    res.body.should.have.property('balance').eql(10000);
                    res.body.should.have.property('exp').eql('04/18');
                    res.body.should.have.property('name').eql('ALYSSA LIVINGSTON');
                    done();
                });
        });

        it('it should POST new card with zero balance', done => {
            chai.request(server)
                .post('/cards')
                .send({
                    cardNumber: '5483874041820682',
                    exp: '04/18',
                    name: 'ALYSSA LIVINGSTON',
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('cardNumber').eql('5483874041820682');
                    res.body.should.have.property('balance').eql(0);
                    res.body.should.have.property('exp').eql('04/18');
                    res.body.should.have.property('name').eql('ALYSSA LIVINGSTON');
                    done();
                });

        });
    });

    describe('/DELETE card', () => {
        it('it should not DELETE card with empty id', done => {
            chai.request(server)
                .delete('/cards/')
                .end((err, res) => {
                    res.should.have.status(405);
                    done();
                });
        });

        it('it should not DELETE card with invalid id', done => {
            chai.request(server)
                .delete('/cards/a')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not DELETE card with not real id', done => {
            chai.request(server)
                .delete('/cards/10')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should DELETE card with real id', done => {
            chai.request(server)
                .delete('/cards/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});