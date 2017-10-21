const router = require('koa-router')();
const ApplicationError = require('../libs/application_error');

/**
 * Добавление транзакции через контекст, переданный в контроллер
 * 
 * @param {any} transaction Транзакция
 * @param {any} ctx Контекс карт
 * @returns 
 */
const addTransaction = async (transaction, ctx) => {
	// проверяем транзакцию
	try {
		await ctx.transactions.validate(transaction);
	} catch (err) {
		ctx.throw(400, err);
	}

	// добавляем транзакцию
	await ctx.transactions.add(transaction);

	// транзакция добавилась, необходимо обновить баланс карты
	await ctx.cards.affectBalance(transaction.cardId, transaction);

	// добавляем вторую транзакцию, если надо 
	if (transaction.type === 'card2Card') {
		const fromCard = await ctx.cards.get(transaction.cardId);
		const toCard = await ctx.cards.getByCardNumber(transaction.data);

		if (!toCard)
			throw new ApplicationError(`Card with cardNumber=${transaction.data} not found`, 404);

		const {time, sum} = transaction;

		const recieverTransaction = {
			cardId: toCard.id,
			type: 'prepaidCard',
			data: fromCard.cardNumber,
			time: time || Math.floor(Date.now() / 1000),
			sum: sum < 0 ? sum * -1 : sum
		};

		await addTransaction(recieverTransaction, ctx);
	}
};

router.get('/', async ctx => ctx.body = await ctx.cards.getAll());

router.get('/:id', async ctx => {
	const {id} = ctx.params;
	const doc = await ctx.cards.get(id);

	if (!doc) ctx.throw(404, `card with id=${id} not found`);
	ctx.body = doc;
});

router.post('/', async ctx => {
	const {cardNumber, exp, name, balance} = ctx.request.body;

	if (!cardNumber || !exp || !name)
		ctx.throw(400, 'properties required');

	const card = {
		cardNumber,
		exp,
		name,
		balance: Number(balance) || 0
	};

	try {
		await ctx.cards.validate(card);
	} catch (err) {
		ctx.throw(400, err);
	}

	ctx.body = await ctx.cards.add(card);
	ctx.status = 201;
});

router.delete('/:id', async ctx => {
	await ctx.cards.remove(ctx.params.id);

	ctx.body = {
		result: 'success'
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

	if (!type || !data || !sum)
		ctx.throw(400, 'properties required');

	const transaction = {
		cardId: id,
		type,
		data,
		time: Number(time) || Math.floor(Date.now() / 1000),
		sum: Number(sum)
	};

	await addTransaction(transaction, ctx);

	ctx.body = {
		status: 'success'
	};

	ctx.status = 201;
});

router.delete('/:id/transactions/:tranId', async ctx => ctx.status = 405);

router.post('/:id/pay', async ctx => {
	const {id} = ctx.params;

	const {phone, amount} = ctx.request.body;
	if (!phone || !amount)
		ctx.throw(400, 'properties required');

	const transaction = {
		cardId: id,
		type: 'paymentMobile',
		data: phone,
		time: Math.floor(Date.now() / 1000),
		sum: Number(amount) > 0 ? Number(amount) * -1 : Number(amount)
	};

	await addTransaction(transaction, ctx);

	ctx.body = {
		status: 'success'
	}

	ctx.status = 201;
});

router.post('/:id/transfer', async ctx => {
	const {id} = ctx.params;

	const {to, amount} = ctx.request.body;
	if (!to || !amount)
		ctx.throw(400, 'properties required');

	const transaction = {
		cardId: id,
		type: 'card2Card',
		data: to,
		time: Math.floor(Date.now() / 1000),
		sum: Number(amount) > 0 ? Number(amount) * -1 : Number(amount)
	};

	await addTransaction(transaction, ctx);

	ctx.body = {
		status: 'success'
	};

	ctx.status = 201;
});

module.exports = router;
