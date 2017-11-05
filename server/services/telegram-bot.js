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

    /**
    * Контекст пользователя
    * @param {String} id идентификатор пользователя
    * @returns {Context} Контекст транзакций
    */
    transactions(id) {
        return new TransactionsContext(id);
    }

    /**
    * Контекст пользователя
    * @param {String} id идентификатор пользователя
    * @returns {Context} Контекст карт
    */
    cards(id) {
        return new CardsContext(id);
    }

    /**
    * Контекст пользователя
    * @returns {Context} Контекст пользователей
    */
    users() {
        return new UsersContext();
    }

    /**
    * Находит пользователя по id
    * @param {String} id идентификатор пользователя
    * @returns {Object} Объект пользователя
    */
    async userInstance(id) {
        const _id = id.toString();
        return await this.users().getOne({chatId: _id});
    }

    /**
    * Находит пользователя по секретному ключу
    * @param {String} telegramKey Секретный ключ
    * @returns {Object} Объект пользователя
    */
    async getUserByTelegramKey(telegramKey) {
        const _key = telegramKey.toString();
        return await this.users().getOne({telegramKey: _key});
    }

    /**
    * Инициализирует стартовую команду
    * @param {Object} user Объект пользователя
    * 
    */
    initBotCommands() {
        this.setUserChatId();
    }

    /**
    * Инициализирует чат с ботом
    * @param {Object} user Объект пользователя
    * 
    */
    initChatId(user) {
        if (user && user.chatId) {
          this.getCardsList(user);
          this.getTransactions(user);
        }
    }

    /**
    * Команда списка транзакций по карте
    * @param {Object} user Объект пользователя
    * 
    */
    getTransactions(user) {
        this.bot.command('/last', async (ctx) => {
            const _card = ctx.message.text.substr(ctx.message.text.length - 4);
            const cards = await this.cards(user.id);
            const card = await cards.getOne({cardNumber: {'$regex': `${_card}$`}});
            if (card) {
                const transactions = this.transactions(user.id);
                const allTransactions = await transactions.getTransactions(card.id);
                if(allTransactions && allTransactions.length > 0) {
                    ctx.reply(`Here is some of your latest transactions from
                    💳 **** **** **** ${_card} 💳 
                    
                    Transactions:
                    ${allTransactions.map((transaction) => `Sum: ${transaction.sum} ${CURRENCY_ENUM[card.currency]} | Type: ${transaction.type} | Time: ${moment(transaction.time).format('H:mm DD/MM/YY ')}`).join('\n')}`);
                } else {
                    ctx.reply(`🙄 There are no transactions with this card.`);
                }
            } else {
                ctx.reply(`🙄 There are no such card assigned for you.`);
            }
        });
    }

    /**
    * Команда списка карт пользователя
    * @param {Object} user Объект пользователя
    * 
    */
    getCardsList(user) {
        this.bot.command('/allcards', async (ctx) => {
            const allCards = await this.cards(user.id).getAll();
            if(allCards && allCards.length > 0) {
                ctx.reply(allCards.map((card) => `
                💳 **** **** **** ${card.cardNumber.substr(card.cardNumber.length - 4)}
                Money availvable: ${card.balance} ${CURRENCY_ENUM[card.currency]}
                Card will expire ${card.exp}
                __________________________
                `).join('\n'));
            } else {
                ctx.reply(`🙄 There are no such card assigned for you.`);
            }
        });
    }

    /**
    * Проводит верификацию секретного ключа пользователя
    *
    */
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

}

module.exports = new TelegramBot();