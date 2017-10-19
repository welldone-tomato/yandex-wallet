const assert = require('assert');
const Card = require('../../models/card');

describe('Cards model reading test', () => {
    let card;

    beforeEach(done => {
        card = new Card({
            cardNumber: "5483874041820682",
            balance: 20,
            exp: "08/18",
            name: "NIK COLLIN"
        });

        card.save().then(() => done()).catch(err => done(err));
    });

    it('finds all cards', done => {
        Card.find({})
            .then(cards => {
                assert(cards[0]._id.toString() === card._id.toString());
                done();
            });
    });
});
