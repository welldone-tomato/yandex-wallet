import * as actions from '../actions/types';

/**
 * Возвращает массив с обновленным элементом
 * 
 * @param {Array} array 
 * @param {Object} action 
 * @returns {Array}
 */
const addOrUpdateObjectInArray = (array, newItem) => {
    let isNew = true;
    const newArray = array.map((item) => {
        if (item.id !== newItem.id) return item;
        isNew = false;
        return newItem;
    });
    if (isNew) newArray.push(newItem);
    return newArray;
};

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

        case actions.CARD_ADD_FAILED:
            return {
                ...state,
                error: payload
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
                data: addOrUpdateObjectInArray(state.data, payload)
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
