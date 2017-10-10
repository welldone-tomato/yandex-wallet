import * as actions from '../actions/types';

const transactionsInitialState = {
    data: [],
    error: null
};

const transactionsReducer = (state = transactionsInitialState, {type, payload}) => {
    switch (type) {
        case actions.FETCH_TRANS_SUCCESS:
            return {
                ...state,
                data: payload,
                error: null
            }

        case actions.FETCH_TRANS_FAILED:
            return {
                ...state,
                error: payload
            }

        case actions.FETCH_CARDS_FAILED:
            return transactionsInitialState

        case actions.USER_LOGOUT:
            return transactionsInitialState

        default:
            return state
    }
};

export default transactionsReducer;
