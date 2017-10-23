const assert = require('assert');
const Card = require('../../models/card');
const Transaction = require('../../models/transaction');

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

describe('Transaction model validation tests', () => {
    it('it should get errors with massages about requeries fields', done => {
        const transaction = new Transaction({});

        transaction.validate(validationResult => {
            const {message} = validationResult;

            assert(message === 'transaction validation failed: sum: sum of transaction is required, data: data for transaction is required, type: type of transaction is required, cardId: cardId is required');
            done();
        });
    });

    it('it should get errors with massages about invalid fields', done => {
        const transaction = new Transaction({
            cardId: '59c784e',
            type: 'prepaidCard2ee',
            data: 'yandex money 33222335',
            sum: 'a'
        });

        transaction.validate(validationResult => {
            const {cardId, sum, type} = validationResult.errors;

            assert(cardId.message === 'Cast to ObjectID failed for value "59c784e" at path "cardId"');
            assert(sum.message === 'Cast to Number failed for value "a" at path "sum"');
            assert(type.message === '`prepaidCard2ee` is not a valid enum value for path `type`.');

            done();
        });
    });

    it('it should get errors with massages about not founded card', done => {
        const transaction = new Transaction({
            cardId: '59e9ce16131a183238cc7845',
            type: 'prepaidCard',
            data: 'yandex money 33222335',
            sum: 10
        });

        transaction.validate(validationResult => {
            const {cardId} = validationResult.errors;

            assert(cardId.message === 'card with this id not found');

            done();
        });
    });

    it('it should get errors with massages about not founded card in card2card transaction', done => {
        const transaction = new Transaction({
            cardId: '59e9ce16131a183238cc784e',
            type: 'card2Card',
            data: '59e9ce16131a183238cc7844',
            sum: -10
        });

        transaction.validate(validationResult => {
            assert(validationResult.message === 'transaction validation failed: type: receiver card not found');

            done();
        });
    });

    it('it should get errors with massages about invalid sum of the transaction', done => {
        const transaction = new Transaction({
            cardId: '59e9ce16131a183238cc784e',
            type: 'paymentMobile',
            data: '89214445599',
            sum: 10
        });

        transaction.validate(validationResult => {
            assert(validationResult.message === 'transaction validation failed: sum: invalid transaction sum');

            done();
        });
    });

    it('it should get errors with massages about invalid balance on the card', done => {
        const transaction = new Transaction({
            cardId: '59e9ce16131a183238cc784e',
            type: 'paymentMobile',
            data: '89214445599',
            sum: -16000
        });

        transaction.validate(validationResult => {
            assert(validationResult.message === 'transaction validation failed: sum: invalid transaction sum');

            done();
        });
    });
});