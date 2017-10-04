import CardInfo from 'card-info';

import * as actions from '../actions/types';

/**
	 * Подготавливает данные карт
	 *
	 * @param {Object} cardsData данные карт
	 * @returns {Object[]}
	 */
const prepareCardsData = cardsData => {
    return cardsData.map(card => {
        const cardInfo = new CardInfo(card.cardNumber, {
            banksLogosPath: '/assets/',
            brandsLogosPath: '/assets/'
        });

        return {
            id: card.id,
            balance: card.balance,
            number: cardInfo.numberNice,
            bankName: cardInfo.bankName,
            theme: {
                bgColor: cardInfo.backgroundColor,
                textColor: cardInfo.textColor,
                bankLogoUrl: cardInfo.bankLogoSvg,
                brandLogoUrl: cardInfo.brandLogoSvg,
                bankSmLogoUrl: `/assets/${cardInfo.bankAlias}-history.svg`
            }
        };
    });
};

const cardsInitialState = {
    data: [],
    error: null
};

const cardsReducer = (state = cardsInitialState, {type, payload}) => {
    switch (type) {
        case actions.FETCH_CARDS_SUCCESS:
            return {
                ...state,
                data: prepareCardsData(payload),
                error: null
            }

        case actions.FETCH_CARDS_FAILED:
            return {
                ...state,
                error: payload
            }

        case actions.USER_LOGOUT:
            return cardsInitialState

        case actions.CHANGE_ACTIVE_CARD:
            return {
                ...state,
                activeId: payload,
                activeCard: state.data.find(item => item.id === payload)
            }

        default:
            return state
    }
};

export default cardsReducer;
