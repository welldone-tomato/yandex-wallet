import CardInfo from 'card-info';

import { createSelector } from 'reselect';

/**
	 * Подготавливает данные карты
	 *
	 * @param {Object} card данные карты
	 * @returns {Object[]}
	 */
const prepareCardData = card => {
    const {numberNice, bankName, backgroundColor, textColor, bankLogoSvg, brandLogoSvg, bankAlias} = new CardInfo(card.cardNumber, {
        banksLogosPath: '/assets/',
        brandsLogosPath: '/assets/'
    });

    return {
        id: card.id,
        balance: card.balance,
        number: numberNice,
        cardNumber: card.cardNumber,
        bankName: bankName,
        theme: {
            bgColor: backgroundColor,
            textColor: textColor,
            bankLogoUrl: bankLogoSvg,
            brandLogoUrl: brandLogoSvg,
            bankSmLogoUrl: `/assets/${bankAlias}-history.svg`
        }
    }
}

/**
	 * Подготавливает данные карт
	 *
	 * @param {Object} cardsData данные карт
	 * @returns {Object[]}
	 */
const prepareCardsData = cards => cards.map(card => prepareCardData(card));

const getCards = state => state.cards.data;
const getActiveCardId = state => state.cards.activeCardId;

export const getPreparedCards = createSelector(
    [getCards], cards => prepareCardsData(cards)
);

export const getActiveCard = createSelector(
    [getActiveCardId, getPreparedCards],
    (activeCardId, cards) => cards.find(item => item.id === activeCardId)
);

export const getFilteredCards = createSelector(
    [getActiveCardId, getPreparedCards],
    (activeCardId, cards) => cards.filter(card => card.id !== activeCardId)
);
