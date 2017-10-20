const ApplicationError = require('../libs/application_error');

module.exports = {
    /**
     * Проверяет транзакцию
     * 
     * @param {Object} transaction 
     * @param {CardsContext} cards
     */
    transactionValidator: async (transaction, cards) => {
        const allowedTypes = ['prepaidCard', 'paymentMobile', 'card2Card'];
        const requiredFields = ['sum', 'type', 'data'];

        const missingFields = requiredFields.filter(
            field => !Object.prototype.hasOwnProperty.call(transaction, field) || !transaction[field]);

        if (missingFields.length)
            throw new ApplicationError(`No required fields: ${missingFields.join()}`, 400);

        if (!allowedTypes.includes(transaction.type))
            throw new ApplicationError(`Forbidden transaction type: ${transaction.type}`, 403);

        if (isNaN(transaction.sum))
            throw new ApplicationError(`Invalid transaction sum`, 400);

        const card = await cards.get(transaction.cardId);
        if (!card)
            throw new ApplicationError(`Card with id=${transaction.cardId} not found`, 404);

        if (transaction.type === 'card2Card')
            if (!await cards.checkCardExist(transaction.data))
                throw new ApplicationError(`Receiver card with cardNubmer=${transaction.data} not found`, 404);

        if (card.balance + transaction.sum < 0)
            throw new ApplicationError(`Low balance on card with id=${transaction.cardId}`, 400);

        if ((transaction.type === 'paymentMobile' || transaction.type === 'card2Card') && transaction.sum >= 0)
            throw new ApplicationError(`Invalid transaction sum`, 400);

        if (transaction.type === 'prepaidCard' && transaction.sum <= 0)
            throw new ApplicationError(`Invalid transaction sum`, 400);
    }
};
