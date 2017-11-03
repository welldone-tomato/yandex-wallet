const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const userJson = require('../data_inits/data_users');
const restoreDatabase = require('../test_helper');

const should = chai.should();
chai.use(chaiHttp);

describe('Money requests routes tests', () => {
    let token;
    let guid;

    before(done => {
        chai.request(server)
            .post('/api/auth/signin')
            .send({
                email: userJson[0].email,
                password: userJson[0].password
            })
            .end((err, res) => {
                token = res.body.token;

                chai.request(server)
                    .get('/api/mrs')
                    .set('Authorization', 'JWT ' + token)
                    .end((err, res) => {
                        guid = res.body[0].guid;
                        done();
                    });
            });
    });

    describe('/GET mrs for user', () => {
        it('it should GET all the mrs in db', done => {
            chai.request(server)
                .get('/api/mrs')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    res.body[0].should.not.have.property('userId');
                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('cardId');
                    res.body[0].should.have.property('guid');
                    res.body[0].should.have.property('sum');
                    res.body[0].should.have.property('url');
                    res.body[0].should.have.property('goal');
                    done();
                });
        });

        it('it should GET mrs in db', done => {
            chai.request(server)
                .get('/api/mrs/' + guid)
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('object');
                    res.body.should.not.have.property('userId');
                    res.body.should.not.have.property('id');
                    res.body.should.not.have.property('cardId');
                    res.body.should.have.property('goal');
                    res.body.should.have.property('sum');
                    res.body.should.have.property('userName');
                    res.body.should.have.property('cardNumber');
                    done();
                });
        });

        it('it should GET 404 for invalid guid mrs in db', done => {
            chai.request(server)
                .get('/api/mrs/' + guid + '1')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/POST new mr with error without DB', () => {
        it('it should not POST new mr with empty body', done => {
            chai.request(server)
                .post('/api/mrs')
                .set('Authorization', 'JWT ' + token)
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('properties required');
                    done();
                });
        });

        it('it should not POST new mr with empty cardId', done => {
            chai.request(server)
                .post('/api/mrs')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardId: ''
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('properties required');
                    done();
                });
        });

        it('it should not POST new mr with non valid cardId', done => {
            chai.request(server)
                .post('/api/mrs')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardId: '15133306216010173046'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('moneyRequest validation failed: cardId: Cast to ObjectID failed for value "15133306216010173046" at path "cardId"');
                    done();
                });
        });

        it('it should not POST new mr with non exist cardId', done => {
            chai.request(server)
                .post('/api/mrs')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardId: '59e9ce16131a183238cc7844'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql("moneyRequest validation failed: cardId: card with this id not found");
                    done();
                });
        });
    });

    describe('/POST new mr with DB', () => {
        afterEach(done => restoreDatabase(done));

        it('it should POST new mr', done => {
            chai.request(server)
                .post('/api/mrs')
                .set('Authorization', 'JWT ' + token)
                .send({
                    cardId: '59e9ce16131a183238cc784f',
                    sum: 100
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('url');
                    done();
                });
        });
    });
});