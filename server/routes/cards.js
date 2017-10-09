const router = require('koa-router')();
const Validators = require('../data/validators');

/**
 * Добавление транзакции через контекст, переданный в контроллер
 * 
 * @param {any} transaction Транзакция
 * @param {any} ctx Контекс карт
 * @returns 
 */
const addTransaction = async (transaction, ctx) => {
	let result = false;

	if (await Validators.transactionValidator(transaction, ctx.cards)) {
		result = await ctx.transactions.add(transaction);

		if (result) {
			//Транзакция добавилась, необходимо обновить баланс карты
			result = await ctx.cards.affectBalance(transaction.cardId, transaction);

			// Добавляем вторую транзакцию 
			if (result && transaction.type === 'card2Card') {
				const fromCard = await ctx.cards.get(transaction.cardId);
				const recieverCard = await ctx.cards.getByCardNumber(transaction.data);
				if (recieverCard && fromCard) {
					const {time, sum} = transaction;

					const recieverTransaction = {
						cardId: recieverCard.id,
						type: 'prepaidCard',
						data: fromCard.cardNumber,
						time: Number(time) || Date.now() / 1000,
						sum: Number(sum) < 0 ? Number(sum) * -1 : Number(sum)
					};

					if (await Validators.transactionValidator(recieverTransaction, ctx.cards)) {
						result = await ctx.transactions.add(recieverTransaction);

						if (result)
							//Транзакция добавилась, необходимо обновить баланс карты
							result = await ctx.cards.affectBalance(recieverCard.id, recieverTransaction);
					}
				}
			}
		}
	}

	return result;
};

router.get('/', async ctx => ctx.body = await ctx.cards.getAll());

router.get('/:id', async ctx => {
	ctx.body = await ctx.cards.get(ctx.params.id);;
	ctx.status = 200;
});

router.post('/', async ctx => {
	const {cardNumber, exp, name} = ctx.request.body;
	let {balance} = ctx.request.body;

	if (!cardNumber || !exp || !name)
		ctx.throw(400, 'cardNumber required');

	balance = Number(balance) || 0;
	if (isNaN(balance)) ctx.throw(400, 'balance is invalid');

	const card = {
		cardNumber,
		exp,
		name,
		balance
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
		time: Number(time) || Date.now() / 1000,
		sum: Number(sum)
	};

	const result = await addTransaction(transaction, ctx);

	ctx.body = {
		status: result ? 'success' : 'failed'
	};

	if (result)
		ctx.status = 201
	else
		ctx.status = 500;
});

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

	const result = await addTransaction(transaction, ctx);

	ctx.body = {
		status: result ? 'success' : 'failed'
	};

	if (result)
		ctx.status = 201
	else
		ctx.status = 500;

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

	const result = await addTransaction(transaction, ctx);

	ctx.body = {
		status: result ? 'success' : 'failed'
	};

	if (result)
		ctx.status = 201
	else
		ctx.status = 500;

});

module.exports = router;
