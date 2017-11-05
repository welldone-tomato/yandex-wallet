const bot = require('../../libs/bot');
const ObjectId = require('mongoose').Types.ObjectId;
const TelegramBot = require('../../services/telegram-bot');

module.exports = async (ctx) => {
	const user = await ctx.users.getOne({_id: new ObjectId(ctx.params.userId)});
	if (user.chatId) {
		TelegramBot.initChatId(user);
	}
	ctx.body = await ctx.cards.getAll()
};
