import * as actions from '../actions/types';

const transactionsInitialState = {
    data: []
};

const transactionsReducer = (state = transactionsInitialState, {type, payload}) => {
    switch (type) {
        case actions.FETCH_TRANS_SUCCESS:
            return payload
        case actions.FETCH_TRANS_FAILED:
            return payload
        default:
            return state
    }
};

export default transactionsReducer;