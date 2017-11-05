module.exports = async ctx => ctx.body = await ctx.money_requests.getAll();
