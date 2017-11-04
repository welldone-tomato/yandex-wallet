const CardsContext = require('../data/cards_context');
const TransactionsContext = require('../data/transactions_context');
const UsersContext = require('../data/users_context');
const ObjectId = require('mongoose').Types.ObjectId;

class TelegramBot {
    constructor() {
        this.bot = require('../libs/bot');
        this.initBotCommands();
        this.chatId = "";
        this.userId = "";
    }

    transactions(id) {
        return new TransactionsContext(id);
    }

    cards(id) {
        return new CardsContext(id);
    }

    users() {
        return new UsersContext();
    }

    async userInstance(id) {
        const _id = id.toString();
        return await this.users().getOne({chatId: _id});
    }

    initBotCommands() {
        this.chatId();
        // this.getUser();
    }

    chatId() {
        this.bot.command('/chatid', async (ctx) => {
            const user = await this.userInstance(ctx.chat.id);
            this.getCardsList(user);
            this.getTransactions(user);
            ctx.reply(`text ${ctx.message.text}
id: ${user.id}`);
        });
    }

    getTransactions(user) {
        this.bot.command('/last', async (ctx) => {
            const _card = ctx.message.text.substr(ctx.message.text.length - 4);
            const cards = await this.cards(user.id);
            const card = await cards.getOne({cardNumber: {'$regex': `${_card}$`}});
            const transactions = this.transactions(user.id);
            ctx.reply(await transactions.getByCardId(card.id));
            // ctx.reply(_card)
        })
    }

    getCardsList(user) {
        this.bot.command('/allcards', async (ctx) => {
            ctx.reply(await this.cards(user.id).getAll())
        })
    }

    getUser() {
        this.bot.command('/user', async (ctx) => {
            ctx.reply(await this.setUser())
        })
    }

    /**
	 * Отправляет Telegram-оповещение пользователю
	 *
	 * @param {Object} notificationParams параметры нотификации
	 */
	sendNotification(notificationParams) {
        const {chatId} = notificationParams.user;
        const {card, phone, amount}= notificationParams;
        const cardNumberSecure = card.cardNumber.substr(card.cardNumber.length - 4);
		var message;
		if (notificationParams.type == 'paymentMobile') {
			message = `С вашей карты **** **** **** ${cardNumberSecure} было переведено ${amount}${card.currency} на телефон ${phone}`;
		} else {
			message = `На вашу карту **** **** **** ${cardNumberSecure}  поступило ${amount}${card.currency}`;
		}
		if (chatId) {
			this.bot.telegram.sendMessage(chatId, message);
		}
    }
    

}

module.exports = new TelegramBot();