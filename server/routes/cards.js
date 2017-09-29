const router = require('koa-router')();
const bankUtils = require('../libs/utils');

router.get('/', async ctx => ctx.body = await ctx.cards.getCardsNumbers());

router.post('/', async ctx => {
	const {cardNumber, balance} = ctx.request.body;

	if (!cardNumber)
		ctx.throw(400, 'cardNumber required')

	const cardType = bankUtils.getCardType(cardNumber);
	if (cardType === '' || !bankUtils.moonCheck(cardNumber)) ctx.throw(400, 'valid cardNumber required');

	const cardsNumbers = await ctx.cards.getCardsNumbers();

	if (cardsNumbers.includes(cardNumber)) ctx.throw(400, 'non doublicated cardNumber required')

	let newCard = {
		cardNumber,
		balance: balance || 0
	};

	newCard = await ctx.cards.add(newCard);

	ctx.body = {
		...newCard,
		cardType
	};

	ctx.status = 201;
});

router.delete('/:id', async ctx => {
	const {id} = ctx.params;

	const result = await ctx.cards.remove(id);

	ctx.body = {
		result: result ? 'success' : 'failed'
	};
	ctx.status = 200;
});

router.get('/:id/transactions', async ctx => {
	const {id} = ctx.params;

	ctx.body = await ctx.transactions.getByCardId(id);
	ctx.status = 200;
});

router.post('/:id/transactions', async ctx => {
	const {id} = ctx.params;

	const {type, data, time, sum} = ctx.request.body;
	if (!type || !data || !time || !sum)
		ctx.throw(400, 'missing param required')

	const card = await ctx.cards.get(id);

	if (!card)
		ctx.throw(400, `Card with id=${id} not found`);

	const result = await ctx.transactions.add({
		cardId: id,
		type,
		data,
		time,
		sum
	});

	ctx.body = {
		status: result ? 'success' : 'failed'
	};
	ctx.status = 201;
});

module.exports = router;
