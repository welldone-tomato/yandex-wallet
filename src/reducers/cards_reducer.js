import * as actions from '../actions/types';

/**
 * Возвращает массив с обновленным элементом
 * 
 * @param {Array} array 
 * @param {Object} action 
 * @returns {Array}
 */
const updateObjectInArray = (array, newItem) => array.map(item => item.id !== newItem.id ? item : newItem);

export const cardsInitialState = {
    data: [],
    error: null,
    isLoading: false,
    activeCardId: null
};

const cardsReducer = (state = cardsInitialState, {type, payload}) => {
    switch (type) {
        case actions.CARDS_FETCH_STARTED:
            return {
                ...state,
                isLoading: state.data.length === 0 ? true : false
            }

        case actions.CARDS_FETCH_SUCCESS:
            return {
                ...state,
                data: payload,
                error: null,
                isLoading: false
            }

        case actions.CARDS_FETCH_FAILED:
            return {
                ...state,
                error: payload,
                isLoading: false
            }

        case actions.USER_LOGOUT:
            return cardsInitialState

        case actions.ACTIVE_CARD_CHANGED:
            return {
                ...state,
                activeCardId: payload
            }

        case actions.CARD_FETCH_SUCCESS:
            return {
                ...state,
                data: updateObjectInArray(state.data, payload)
            }

        case actions.CARD_FETCH_FAILED:
            return {
                ...state,
                error: payload
            }

        default:
            return state
    }
}

export default cardsReducer;
