const router = require('koa-router')();
const moment = require('moment');
const PassThrough = require('stream').PassThrough;
const logger = require('../libs/logger')('cards-router');

/**
 * Добавление транзакции через контекст, переданный в контроллер
 * 
 * @param {Object} transaction Транзакция
 * @param {Object} ctx Контекс карт
 * @param {Object} card Карта инициатор
 * @param {Object} toCard Карта получатель - опционально
 * @returns 
 */
const addTransaction = async (transaction, ctx, card, toCard) => {
	// проверяем транзакцию
	try {
		await ctx.transactions.validate(transaction);
	} catch (err) {
		ctx.throw(400, err);
	}

	// добавляем транзакцию и сохраняем ссылку
	const savedTransaction = await ctx.transactions.add(transaction);

	try { // транзакция добавилась, необходимо обновить баланс карты
		await ctx.cards.affectBalance(card.id, transaction);

		// добавляем вторую транзакцию, если надо 
		if (transaction.type === 'card2Card') {
			const {time, sum} = transaction;

			const recieverTransaction = {
				cardId: toCard.id,
				type: 'prepaidCard',
				data: card.cardNumber,
				time: time || Math.floor(Date.now() / 1000),
				sum: sum < 0 ? sum * -1 : sum
			};

			await addTransaction(recieverTransaction, ctx, toCard);
		}
	} catch (err) {
		//помечаем транзакцию невалидной
		await ctx.transactions.setInvalid(savedTransaction.id, err);

		logger.error(`payment error with transaction= ${JSON.stringify(transaction)}`, err);
		ctx.throw(500, 'payment error. call to support');
	}
};

/**
 * Трансформирует поток транзакций в потом CSV строк
 * 
 * @param {any} cursor 
 * @param {any} stream 
 * @param {any} ctx 
 */
const transactionsToCSV = (cursor, stream, ctx) => {
	const fieldToString = field => '"' + String(field || "").replace(/\"/g, '""') + '"';

	const headers = [
		'Id',
		'Time',
		'Sum',
		'Type',
		'Data'
	].map(fieldToString).join(',');

	const docToString = doc => [
		doc.id,
		doc.time,
		doc.sum,
		doc.type,
		doc.data,
	].map(fieldToString).join(',');

	let started = false;

	const start = stream => {
		stream.write(headers + '\n');
		started = true;
	}

	cursor
		.on('data', transaction => {
			if (!started)
				start(stream);
			stream.write(docToString(transaction) + '\n')
		})
		.on('close', () => ctx.res.end())
		.once('error', err => ctx.throw(500, {
			msg: "Failed to get CSV"
		}));
};

//****************************** ROUTES *************************************/
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
		balance: Number(balance) || 0,
		userId: ctx.params.userId
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

router.get('/:id/file-transactions', async ctx => {
	const cursor = await ctx.transactions.getByCardIdStream(ctx.params.id);
	const stream = new PassThrough();

	transactionsToCSV(cursor, stream, ctx);
	ctx.type = 'csv';
	ctx.set('Content-disposition', `attachment; filename=${moment().format('DD-MM-YYYY')}-transactions-history.csv`);
	ctx.body = stream;
});

router.post('/:id/transactions', async ctx => {
	const {id} = ctx.params;

	const {type, data, time, sum} = ctx.request.body;

	if (!type || !data || !sum)
		ctx.throw(400, 'properties required');

	const card = await ctx.cards.get(id);
	if (!card) ctx.throw(404, `card with id=${id} not found`);

	const transaction = {
		cardId: id,
		type,
		data,
		time: Number(time) || Math.floor(Date.now() / 1000),
		sum: Number(sum)
	};

	await addTransaction(transaction, ctx, card);

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

	const card = await ctx.cards.get(id);
	if (!card) ctx.throw(404, `card with id=${id} not found`);

	const transaction = {
		cardId: id,
		type: 'paymentMobile',
		data: phone,
		time: Math.floor(Date.now() / 1000),
		sum: Number(amount) > 0 ? Number(amount) * -1 : Number(amount)
	};

	await addTransaction(transaction, ctx, card);

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

	const card = await ctx.cards.get(id);
	if (!card) ctx.throw(404, `card with id=${id} not found`);

	const toCard = await ctx.cards.getByCardNumber(to);
	if (!toCard) ctx.throw(404, `card with cardNumber=${to} not found`);

	const transaction = {
		cardId: id,
		type: 'card2Card',
		data: to,
		time: Math.floor(Date.now() / 1000),
		sum: Number(amount) > 0 ? Number(amount) * -1 : Number(amount)
	};

	await addTransaction(transaction, ctx, card, toCard);

	ctx.body = {
		status: 'success'
	};

	ctx.status = 201;
});

module.exports = router;
