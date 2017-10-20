const assert = require('assert');
const ObjectId = require('mongoose').Types.ObjectId;

const Card = require('../../models/card');
const cardsJson = require('../data_cards');

describe('Cards model reading test', () => {
    it('it should get all cards', async () => {
        const cards = await Card.find({});
        assert(cards.length === 5);
        assert(cards[0].cardNumber === cardsJson[0].cardNumber);
    });

    it('it should get a card by id', async () => {
        const card = await Card.findOne({})
        const result = await Card.findOne({
            _id: new ObjectId(card.id)
        });

        assert(result.cardNumber === cardsJson[0].cardNumber);
    });
});
