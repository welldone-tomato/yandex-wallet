const addTransaction = require('../add-transaction-method');

module.exports = async ctx => {
	const {id} = ctx.params;

	const {guid, amount} = ctx.request.body;
	if (!guid || !amount)
		ctx.throw(400, 'properties required');

	const card = await ctx.cards.get(id);
	if (!card) ctx.throw(404, `card with id=${id} not found`);

	const toCard = await ctx.money_requests.getCardByGUIDInternal(guid);
	if (!toCard) ctx.throw(404, `card on monay request with guid=${guid} not found`);

	const transaction = {
		cardId: id,
		type: 'card2Card',
		data: toCard.cardNumber,
		time: Math.floor(Date.now() / 1000),
		sum: Number(amount) > 0 ? Number(amount) * -1 : Number(amount)
	};

	await addTransaction(transaction, ctx, card, toCard);

	ctx.body = {
		status: 'success'
	};

	ctx.status = 201;
};
