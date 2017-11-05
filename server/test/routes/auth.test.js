const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const userJson = require('../data_inits/data_users');
const restoreDatabase = require('../test_helper');

const should = chai.should();
chai.use(chaiHttp);

describe('Auth routes tests without DB', () => {
    let token;

    before(done => {
        chai.request(server)
            .post('/api/auth/signin')
            .send({
                email: userJson[0].email,
                password: userJson[0].password
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    it('it should get 401 with user not found', done => {
        chai.request(server)
            .post('/api/auth/signin')
            .send({
                email: 'IVAN@IVAN.NET',
                password: '111111'
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql("Нет такого пользователя");
                done();
            });
    });

    it('it should get 401 with user password fail', done => {
        chai.request(server)
            .post('/api/auth/signin')
            .send({
                email: userJson[0].email,
                password: '111111'
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql("Нет такого пользователя или пароль неверен");
                done();
            });
    });

    it('it should get 401 with cards route match', done => {
        chai.request(server)
            .get('/api/cards')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('it should get 401 with mr route match', done => {
        chai.request(server)
            .get('/api/mrs')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('it should get 401 with cards route match', done => {
        chai.request(server)
            .get('/api/cards')
            .set('Authorization', 'JWT ')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
});

describe('Auth routes tests with DB', () => {
    afterEach(done => restoreDatabase(done));

    it('it should successfully signup user', done => {
        chai.request(server)
            .post('/api/auth/signup')
            .send({
                email: 'me@ivan.net',
                password: 'IvanIvan45&&'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                res.body.should.have.property('user').eql('me@ivan.net');

                done();
            });
    });
});
