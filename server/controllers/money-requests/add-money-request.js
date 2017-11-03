const {DOMAIN} = require('../../config-env');

module.exports = async ctx => {
    const {cardId, sum} = ctx.request.body;

    if (!cardId)
        ctx.throw(400, 'properties required');

    const mr = {
        cardId,
        sum: Math.abs(Number(sum)) || 0,
        userId: ctx.params.userId
    };

    try {
        await ctx.money_requests.validate(mr);
    } catch (err) {
        ctx.throw(400, err);
    }

    const {hash} = await ctx.money_requests.add(mr);
    ctx.body = {
        url: `http://${DOMAIN}/payme/${hash}`
    }
    ctx.status = 201;
};
