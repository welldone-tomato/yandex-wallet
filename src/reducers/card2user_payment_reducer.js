import * as actions from '../actions/types';

const card2UserReducerInitialState = {
    stage: 'contract',
    transaction: null,
    error: null
};

const card2UserReducer = (state = card2UserReducerInitialState, {type, payload}) => {
    switch (type) {
        case actions.CARD2USER_PAY_REPEAT:
            return card2UserReducerInitialState

        case actions.CARD2USER_PAY_SUCCESS:
            return {
                ...state,
                stage: 'success',
                transaction: payload,
                error: null
            }

        case actions.CARD2USER_PAY_FAILED:
            return {
                ...state,
                stage: 'error',
                transaction: payload.transaction,
                error: payload.error
            }

        default:
            return state
    }
}

export default card2UserReducer;
