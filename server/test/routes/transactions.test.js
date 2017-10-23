const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');

const should = chai.should();
chai.use(chaiHttp);

describe('Transactions routes test', () => {
    describe('/GET transactions by card id', () => {
        it('should get all transactions by card id', done => {
            chai.request(server)
                .get('/cards/59e9ce16131a183238cc784e/transactions')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('cardId');
                    res.body[0].should.have.property('type');
                    res.body[0].should.have.property('data');
                    res.body[0].should.have.property('time');
                    res.body[0].should.have.property('sum');

                    done();
                });
        });

        it('should get empty list of transactions by card id === 59e9ce16131a183238cc7846', done => {
            chai.request(server)
                .get('/cards/59e9ce16131a183238cc7846/transactions')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST new transactions', () => {
        it('should get 400 on post transaction on error cardId', done => {
            chai.request(server)
                .post('/cards/59e9ce16131a183238cc7846/transactions')
                .send({
                    type: 'prepaidCard',
                    data: 'YANDEX CASH',
                    sum: 10
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should get 400 on post transaction on missing params', done => {
            chai.request(server)
                .post('/cards/59e9ce16131a183238cc784e/transactions')
                .send({
                    type: 'prepaidCard'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should get 400 on post transaction on invalid params', done => {
            chai.request(server)
                .post('/cards/59e9ce16131a183238cc784e/transactions')
                .send({
                    type: 'prepaidCardsss',
                    data: 'YANDEX CASH',
                    sum: 10
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should not add new transaction with very big charge', done => {
            chai.request(server)
                .post('/cards/59e9ce16131a183238cc784e/transactions')
                .send({
                    type: 'paymentMobile',
                    data: '79213334455',
                    sum: -16000
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should not add new transaction card2card with not real receiver', done => {
            chai.request(server)
                .post('/cards/59e9ce16131a183238cc784e/transactions')
                .send({
                    type: 'card2Card',
                    data: '4024007153305543',
                    sum: -1600
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should not add new transaction with invalid sum', done => {
            chai.request(server)
                .post('/cards/59e9ce16131a183238cc784e/transactions')
                .send({
                    type: 'paymentMobile',
                    data: '79213334455',
                    sum: 1600
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should add new transaction with phone payment', done => {
            const id = '59e9ce16131a183238cc784e';
            chai.request(server)
                .post(`/cards/${id}/pay`)
                .send({
                    phone: '79213334455',
                    amount: 10
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');

                    chai.request(server)
                        .get(`/cards/${id}/transactions`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.type.should.eql('application/json');
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(4);
                            res.body[3].should.have.property('id')
                            res.body[3].should.have.property('cardId').eql(id);
                            res.body[3].should.have.property('type').eql('paymentMobile');
                            res.body[3].should.have.property('data').eql('79213334455');
                            res.body[3].should.have.property('sum').eql(-10);

                            chai.request(server)
                                .get(`/cards/${id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.type.should.eql('application/json');
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('balance').eql(14990);

                                    done();
                                });
                        });
                });
        });

        it('should add new transaction with card2card operation', done => {
            chai.request(server)
                .post('/cards/59e9ce16131a183238cc784e/transfer')
                .send({
                    to: '4011733472066880',
                    amount: 100
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');

                    chai.request(server)
                        .get('/cards/59e9ce16131a183238cc784e/transactions')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.type.should.eql('application/json');
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(4);
                            res.body[3].should.have.property('id');
                            res.body[3].should.have.property('cardId').eql('59e9ce16131a183238cc784e');
                            res.body[3].should.have.property('type').eql('card2Card');
                            res.body[3].should.have.property('data').eql('4011733472066880');
                            res.body[3].should.have.property('sum').eql(-100);

                            chai.request(server)
                                .get('/cards/59e9ce16131a183238cc784f/transactions')
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.type.should.eql('application/json');
                                    res.body.should.be.a('array');
                                    res.body.length.should.be.eql(3);
                                    res.body[2].should.have.property('id');
                                    res.body[2].should.have.property('cardId').eql('59e9ce16131a183238cc784f');
                                    res.body[2].should.have.property('type').eql('prepaidCard');
                                    res.body[2].should.have.property('data').eql('5469259469067206');
                                    res.body[2].should.have.property('sum').eql(100);

                                    chai.request(server)
                                        .get('/cards/59e9ce16131a183238cc784e')
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.type.should.eql('application/json');
                                            res.body.should.be.a('object');
                                            res.body.should.have.property('balance').eql(14900);

                                            chai.request(server)
                                                .get('/cards/59e9ce16131a183238cc784f')
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    res.type.should.eql('application/json');
                                                    res.body.should.be.a('object');
                                                    res.body.should.have.property('balance').eql(1800);

                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });
    });

    describe('/DELETE transaction', () => {
        it('should 405 on delete transaction attemp', done => {
            chai.request(server)
                .delete('/cards/59e9ce16131a183238cc784f/transactions/59e9ce16131a183238cc784f')
                .end((err, res) => {
                    res.should.have.status(405);
                    done();
                });
        });
    });
});