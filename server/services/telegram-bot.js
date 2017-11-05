const CardsContext = require('../data/cards_context');
const TransactionsContext = require('../data/transactions_context');
const UsersContext = require('../data/users_context');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');


const CURRENCY_ENUM = {
    'RUB': '🇷🇺 р.',
    'USD': '🇺🇸 $',
    'EUR': '🇪🇺 €'
}

class TelegramBot {
    constructor() {
        this.bot = require('../libs/bot');
        this.initBotCommands();
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
            const allTransactions = await transactions.getTransactions(card.id);
            // ctx.reply(await transactions.getByCardId(card.id));
            ctx.reply(`Here is some of your latest transactions from
💳 **** **** **** ${_card} 💳 

Transactions:
${allTransactions.map((transaction) => `Sum: ${transaction.sum} ${CURRENCY_ENUM[card.currency]} | Type: ${transaction.type} | Time: ${moment(transaction.time).format('H:mm DD/MM/YY ')}`).join('\n')}`);
        })
    }

    getCardsList(user) {
        this.bot.command('/allcards', async (ctx) => {
            const allCards = await this.cards(user.id).getAll();
            ctx.reply(allCards.map((card) => `
💳 **** **** **** ${card.cardNumber.substr(card.cardNumber.length - 4)}
Money availvable: ${card.balance} ${CURRENCY_ENUM[card.currency]}
Card will expire ${card.exp}
__________________________

`).join('\n'))
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
            if (inputTelegramKey) {
                const user = await this.getUserByTelegramKey(inputTelegramKey);
                if (user && user.email) {
                  await this.users().addField({"email": user.email}, "chatId", ctx.chat.id);
                  this.initChatId(user);
                  ctx.reply(` ✅ Cool, you are now signed in!
Type: 
/last <Last 4 digits of your 💳  number> 
to get list of transactions`);
                } else {
                  ctx.reply(`❌ Sorry, this is not valid secret Telegram key.
Make sure you inserted correct key.`);
                }
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