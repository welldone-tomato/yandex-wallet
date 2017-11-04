const bot = require('../../libs/bot');

module.exports = async (ctx) => {
	bot.telegram.sendMessage("48677477", 'hello from controller');
	ctx.body = await ctx.cards.getAll()
};
