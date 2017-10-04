const bankUtils = require('../libs/utils');
const router = require('koa-router')();
const Validators = require('../data/validators');

router.get('/', async ctx => ctx.body = await ctx.cards.getAll());

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
		time: Number(time) || Date.now(),
		sum: Number(sum)
	};

	if (await Validators.transactionValidator(transaction, ctx.cards)) {
		let result = await ctx.transactions.add(transaction);

		if (result) {
			//Транзакция добавилась, необходимо обновить баланс карты
			result = await ctx.cards.affectBalance(id, transaction);

			// Добавляем вторую транзакцию 
			if (result && transaction.type === 'card2Card') {
				const fromCard = await ctx.cards.get(id);
				const recieverCard = await ctx.cards.getByCardNumber(transaction.data);
				if (recieverCard && fromCard) {
					const recieverTransaction = {
						cardId: recieverCard.id,
						type: 'prepaidCard',
						data: fromCard.cardNumber,
						time: Number(time) || Date.now(),
						sum: Number(sum) * (-1)
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
