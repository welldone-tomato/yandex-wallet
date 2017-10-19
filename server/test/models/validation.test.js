const assert = require('assert');
const Card = require('../../models/card');

describe('Card models validation tests', () => {
    it('requeries a required fields', done => {
        const card = new Card({});

        card.validate(validationResult => {
            const {message} = validationResult;

            assert(message === 'card validation failed: name: name is required, exp: exp date is required, balance: balance is required, cardNumber: cardNumber is required');
            done();
        });
    });
});
