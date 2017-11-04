const bot = require('../../libs/bot');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = async (ctx) => {
	const user = await ctx.users.getOne({_id: new ObjectId(ctx.params.userId)});
	if (user.chatId && user.chatId.length) {
		bot.telegram.sendMessage(user.chatId, "hello from get-cards controller");
	}
	ctx.body = await ctx.cards.getAll()
};
