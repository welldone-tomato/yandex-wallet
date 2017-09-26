const router = require('koa-router')();
const bankUtils = require('../libs/utils');

router.get('/', async ctx => ctx.body = await ctx.CardsContext.getCardsNumbers());

router.post('/', async ctx => {
	const {body} = ctx.request;
	if (!body)
		ctx.throw(400, 'cardNumber required');

	const {cardNumber} = body;
	if (!cardNumber)
		ctx.throw(400, 'cardNumber required')

	const cardType = bankUtils.getCardType(cardNumber);
	if (cardType === '' || !bankUtils.moonCheck(cardNumber)) ctx.throw(400, 'valid cardNumber required');

	const cardsNumbers = await ctx.CardsContext.getCardsNumbers();

	if (cardsNumbers.includes(cardNumber)) ctx.throw(400, 'non doublicated cardNumber required')

	let newCard = {
		cardNumber,
		balance: 0
	};

	newCard = await ctx.CardsContext.add(newCard);

	ctx.body = {
		id: newCard.id,
		cardNumber: newCard.cardNumber,
		cardType
	};
});

router.delete('/:id', async ctx => {
	const {id} = ctx.params;
	if (!id) ctx.throw(400, 'id is required')

	await ctx.CardsContext.remove(id);

	ctx.status = 200;
});

router.get('/:id/transactions', async ctx => {

	ctx.status = 200;
});

module.exports = router;
