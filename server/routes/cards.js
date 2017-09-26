const router = require('koa-router')();
const bankUtils = require('../libs/utils');
const CardContext = require('../fsdb');

router.get('/', async ctx => ctx.body = await CardContext.readCardsNumbers());

router.post('/', async ctx => {
	const {body} = ctx.request;
	if (!body)
		ctx.throw(400, 'cardNumber required');

	const {cardNumber} = body;
	if (!cardNumber)
		ctx.throw(400, 'cardNumber required')

	const cardType = bankUtils.getCardType(cardNumber);
	if (cardType === '' || !bankUtils.moonCheck(cardNumber)) ctx.throw(400, 'valid cardNumber required');

	const cardsNumber = await CardContext.readCardsNumbers();
	const cards = await CardContext.readCards();

	if (cardsNumber.includes(cardNumber)) ctx.throw(400, 'non doublicated cardNumber required')

	const newCard = {
		id: CardContext.getNextId(cards),
		cardNumber,
		balance: 0
	};

	cards.push(newCard);

	await CardContext.writeCards(cards);

	ctx.body = {
		id: newCard.id,
		cardNumber: newCard.cardNumber,
		cardType
	};
});

router.delete('/:id', async ctx => {
	const {id} = ctx.params;
	if (!id) ctx.throw(400, 'id required')

	const card = await CardContext.findById(parseInt(id, 10));
	const cards = await CardContext.readCards();

	if (!card || !cards) ctx.throw(404, 'card with this id is not found');

	const newCards = cards.filter(card => card.id !== parseInt(id, 10));

	await CardContext.writeCards(newCards);

	ctx.status = 200;
});

module.exports = router;
