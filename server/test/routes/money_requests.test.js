const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const userJson = require('../data_inits/data_users');
// const restoreDatabase = require('../test_helper');

const should = chai.should();
chai.use(chaiHttp);

describe('Money requests routes tests', () => {
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

    describe('/GET mrs for user', () => {
        it('it should GET all the cards in db', done => {
            chai.request(server)
                .get('/api/mrs')
                .set('Authorization', 'JWT ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.eql('application/json');
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    res.body.should.not.have.property('userId');
                    res.body[0].should.have.property('cardId');
                    res.body[0].should.have.property('hash');
                    res.body[0].should.have.property('sum');
                    done();
                });
        });
    });
});