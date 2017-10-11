import * as actions from '../actions/types';

const transactionsInitialState = {
    data: [],
    error: null,
    isLoading: true
};

const transactionsReducer = (state = transactionsInitialState, {type, payload}) => {
    switch (type) {
        case actions.FETCH_TRANS:
            return {
                ...state,
                isLoading: state.data.length === 0 ? true : false
            }

        case actions.FETCH_TRANS_SUCCESS:
            return {
                ...state,
                data: payload,
                error: null,
                isLoading: false
            }

        case actions.FETCH_TRANS_FAILED:
            return {
                ...state,
                error: payload,
                isLoading: false
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
