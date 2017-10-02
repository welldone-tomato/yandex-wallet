import * as actions from '../actions/types';

const cardsInitialState = {
    data: []
};

const cardsReducer = (state = cardsInitialState, {type, payload}) => {
    switch (type) {
        case actions.FETCH_CARDS_SUCCESS:
            return payload
        case actions.FETCH_CARDS_FAILED:
            return payload
        default:
            return state
    }
};

export default cardsReducer;
