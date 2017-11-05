module.exports = async ctx => {
	const {guid} = ctx.params;
	const doc = await ctx.money_requests.getByGUID(guid);

	if (!doc) ctx.throw(404, `mr with guid=${guid} not found`);
	ctx.body = doc;
};
