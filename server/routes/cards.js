const router = require('koa-router')();
const Validators = require('../data/validators');

router.get('/', async ctx => ctx.body = await ctx.cards.getCardsNumbers());

router.post('/', async ctx => {
	const {cardNumber, balance} = ctx.request.body;
	if (!cardNumber)
		ctx.throw(400, 'cardNumber required');

	const card = {
		cardNumber,
		balance: balance || 0
	};

	if (await Validators.cardValidator(card, ctx.cards)) {
		ctx.body = await ctx.cards.add(card);
		ctx.status = 201;
	} else
		ctx.status = 400;
});

router.delete('/:id', async ctx => {
	const result = await ctx.cards.remove(ctx.params.id);

	ctx.body = {
		result: result ? 'success' : 'failed'
	};
	ctx.status = 200;
});

router.get('/:id/transactions', async ctx => {
	ctx.body = await ctx.transactions.getByCardId(ctx.params.id);
	ctx.status = 200;
});

router.post('/:id/transactions', async ctx => {
	const {id} = ctx.params;

	const {type, data, time, sum} = ctx.request.body;

	const transaction = {
		cardId: id,
		type,
		data,
		time,
		sum
	}

	if (await Validators.transactionValidator(transaction, ctx.cards)) {
		let result = await ctx.transactions.add(transaction);

		if (result)
			//Транзакция добавилась, необходимо обновить баланс карты
			result = await ctx.cards.affectBalance(id, transaction);

		ctx.body = {
			status: result ? 'success' : 'failed'
		};

		if (result)
			ctx.status = 201
		else
			ctx.status = 500;
	}
});

module.exports = router;
