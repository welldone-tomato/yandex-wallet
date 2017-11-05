const CardsContext = require('../data/cards_context');
const TransactionsContext = require('../data/transactions_context');
const UsersContext = require('../data/users_context');

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
    
    async getUserByTelegramKey(telegramKey) {
        const _key = telegramKey.toString();
        return await this.users().getOne({telegramKey: _key});
    }

    initBotCommands() {
        this.setUserChatId();
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
    
    setUserChatId() {
        this.bot.command('/getupdates', async (ctx) => {
            const inputTelegramKey = ctx.message.text.split("/getupdates ")[1];
            const user = await this.getUserByTelegramKey(inputTelegramKey);
            if (user && user.email) {
              await this.users().addField({"email": user.email}, "chatId", ctx.chat.id);
              ctx.reply(`Your chatId is set: ${ctx.chat.id}`);
            } else {
              ctx.reply("No user found. Make sure you inserted correct key.");
            }
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
    
    /**
    * Инициализирует чат с ботом
    *
    * @param {Object} user
    */
    initChatId(user) {
        if (user && user.chatId) {
          this.getCardsList(user);
          this.getTransactions(user);
        }
    }

}

module.exports = new TelegramBot();