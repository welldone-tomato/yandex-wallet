const router = require('koa-router')();
const Validators = require('../data/validators');
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
	await Validators.transactionValidator(transaction, ctx.cards);

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
			time: time || Date.now() / 1000,
			sum: sum < 0 ? sum * -1 : sum
		};

		await Validators.transactionValidator(recieverTransaction, ctx.cards);
		await ctx.transactions.add(recieverTransaction);

		await ctx.cards.affectBalance(toCard.id, recieverTransaction);
	}
};

router.get('/', async ctx => ctx.body = await ctx.cards.getAll());

router.get('/:id', async ctx => ctx.body = await ctx.cards.get(ctx.params.id));

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

	await Validators.cardValidator(card, ctx.cards)

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

	const transaction = {
		cardId: id,
		type,
		data,
		time: Number(time) || Date.now() / 1000,
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

	const transaction = {
		cardId: id,
		type: 'paymentMobile',
		data: phone,
		time: Date.now() / 1000,
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

	const transaction = {
		cardId: id,
		type: 'card2Card',
		data: to,
		time: Date.now() / 1000,
		sum: Number(amount) > 0 ? Number(amount) * -1 : Number(amount)
	};

	await addTransaction(transaction, ctx);

	ctx.body = {
		status: 'success'
	};

	ctx.status = 201;
});

module.exports = router;
