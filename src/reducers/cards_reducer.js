import * as actions from '../actions/types';

/**
 * Возвращает массив с обновленным элементом
 * 
 * @param {Array} array 
 * @param {Object} action 
 * @returns {Array}
 */
const updateObjectInArray = (array, newItem) => array.map(item => item.id !== newItem.id ? item : newItem);

const cardsInitialState = {
    data: [],
    error: null
};

const cardsReducer = (state = cardsInitialState, {type, payload}) => {
    switch (type) {
        case actions.FETCH_CARDS_SUCCESS:
            return {
                ...state,
                data: payload,
                error: null
            }

        case actions.FETCH_CARDS_FAILED:
            return {
                ...state,
                error: payload
            }

        case actions.USER_LOGOUT:
            return cardsInitialState

        case actions.ACTIVE_CARD_CHANGE:
            return {
                ...state,
                activeCardId: payload
            }

        case actions.FETCH_CARD_SUCCESS:
            return {
                ...state,
                data: updateObjectInArray(state.data, payload)
            }

        case actions.FETCH_CARD_FAILED:
            return {
                ...state,
                error: payload
            }

        default:
            return state
    }
}

export default cardsReducer;
