const router = require('koa-router')();
const bankUtils = require('../libs/utils');

router.get('/', async ctx => ctx.body = await ctx.cards.getCardsNumbers());

router.post('/', async ctx => {
	const {body} = ctx.request;
	if (!body)
		ctx.throw(400, 'cardNumber required');

	const {cardNumber} = body;
	if (!cardNumber)
		ctx.throw(400, 'cardNumber required')

	const cardType = bankUtils.getCardType(cardNumber);
	if (cardType === '' || !bankUtils.moonCheck(cardNumber)) ctx.throw(400, 'valid cardNumber required');

	const cardsNumbers = await ctx.cards.getCardsNumbers();

	if (cardsNumbers.includes(cardNumber)) ctx.throw(400, 'non doublicated cardNumber required')

	let newCard = {
		cardNumber,
		balance: 0
	};

	newCard = await ctx.cards.add(newCard);

	ctx.body = {
		id: newCard.id,
		cardNumber: newCard.cardNumber,
		cardType
	};
});

router.delete('/:id', async ctx => {
	const {id} = ctx.params;
	if (!id) ctx.throw(400, 'id is required');

	await ctx.cards.remove(id);

	ctx.status = 200;
});

router.get('/:id/transactions', async ctx => {
	const {id} = ctx.params;
	if (!id) ctx.throw(400, 'id is required');

	ctx.body = await ctx.transactions.getByCardId(id);
	ctx.status = 200;
});

module.exports = router;
