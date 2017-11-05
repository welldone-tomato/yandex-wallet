module.exports = async ctx => {
    const formatCardNumber = number => number.substr(0, 4) + '********' + number.substr(12, 15);

    const data = await ctx.transactions.getByCardId(ctx.params.id);

    ctx.body = data.map(t => ({
        ...t,
        data: ['prepaidCard', 'card2Card'].includes(t.type) ? formatCardNumber(t.data) : t.data
    }));
}
