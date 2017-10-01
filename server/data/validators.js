const bankUtils = require('../libs/utils');
const ApplicationError = require('../libs/application_error');

module.exports = {
    /**
     * Проверяет номер карты и возращает ее тип
     * 
     * @param {String} cardNumber 
     * @param {CardsContext} cards
     * @returns {Boolean}
     */
    cardValidator: async ({cardNumber, type, exp} , cards) => {
        if (type === '' || !bankUtils.moonCheck(cardNumber))
            throw new ApplicationError('valid cardNumber required', 400);

        if (await cards.checkCardExist(cardNumber))
            throw new ApplicationError('non doublicated cardNumber required', 400);

        // проверяем срок действия карты
        const date = new Date();
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth() + 1;
        // get parts of the expiration date
        const parts = exp.split('/');
        const year = parseInt(parts[1], 10) + 2000;
        const month = parseInt(parts[0], 10);
        // compare the dates
        if (year < currentYear || (year === currentYear && month < currentMonth))
            throw new ApplicationError('card expired', 400);

        return true;
    },

    transactionValidator: async (transaction, cards) => {
        const allowedTypes = ['prepaidCard', 'paymentMobile', 'card2Card'];
        const requiredFields = ['sum', 'type', 'data'];

        const missingFields = requiredFields.filter(
            field => !Object.prototype.hasOwnProperty.call(transaction, field) || !transaction[field]);

        if (missingFields.length) {
            throw new ApplicationError(`No required fields: ${missingFields.join()}`, 400);
        }

        if (!allowedTypes.includes(transaction.type)) {
            throw new ApplicationError(`Forbidden transaction type: ${transaction.type}`, 403);
        }

        if (isNaN(transaction.sum)) {
            throw new ApplicationError(`Invalid transaction sum`, 400);
        }

        const card = await cards.get(transaction.cardId);
        if (!card)
            throw new ApplicationError(`Card with id=${transaction.cardId} not found`, 404);

        return true;
    }
};
