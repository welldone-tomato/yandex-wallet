import * as actions from '../actions/types';

const initState = [];

const cardsReducer = (state = initState, {type, payload}) => {
    switch (type) {
        case actions.FETCH_CARDS_SUCCESS:
            return payload
        default:
            return state
    }
}

export default cardsReducer;
