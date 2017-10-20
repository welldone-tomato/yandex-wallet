const assert = require('assert');
const Card = require('../../models/card');

describe('Card model validation tests', () => {
    it('it should get errors with massages about requeries fields', done => {
        const card = new Card({});

        card.validate(validationResult => {
            const {message} = validationResult;

            assert(message === 'card validation failed: name: name is required, exp: exp date is required, balance: balance is required, cardNumber: cardNumber is required');
            done();
        });
    });

    it('it should get errors with massages about invalid fields', done => {
        const card = new Card({
            cardNumber: '15133306216010173046',
            balance: -1,
            exp: '04/17',
            name: 'ALYSSALIVINGSTON'
        });

        card.validate(validationResult => {
            const {balance, cardNumber, exp, name} = validationResult.errors;

            assert(balance.message === 'balance must be greater then 0 and must be a number');
            assert(cardNumber.message === 'valid cardNumber required');
            assert(exp.message === 'non expired card required');
            assert(name.message === 'name must contains two words');

            done();
        });
    });

    it('it should get errors with massages about invalid fields 2', done => {
        const card = new Card({
            cardNumber: '5483874041820682',
            balance: '-1',
            exp: '04/ss17',
            name: 'A A'
        });

        card.validate(validationResult => {
            const {balance, exp, name} = validationResult.errors;

            assert(balance.message === 'balance must be greater then 0 and must be a number');
            assert(exp.message === 'exp must be 10/17 pattern match');
            assert(name.message === 'name must contains two words');

            done();
        });
    });

    it('it should get errors with massages about doublicated cardNumber', done => {
        const card = new Card({
            cardNumber: '5469259469067206',
            balance: 10,
            exp: '12/18',
            name: 'AM AM'
        });

        card.validate(validationResult => {
            assert(validationResult.message === 'card validation failed: cardNumber: Error, expected `cardNumber` to be unique. Value: `5469259469067206`');
            
            done();
        });
    });

    it('it should pass the verification', done => {
        const card = new Card({
            cardNumber: '5483874041820682',
            balance: 10,
            exp: '10/20',
            name: 'AM AM'
        });

        card.validate(validationResult => {
            assert.strictEqual(validationResult, null);

            done();
        });
    });
});
