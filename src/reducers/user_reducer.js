import * as actions from '../actions/types';

export const userInitialState = {
    data: [],
    isLoading: false,
    telegramKey: null,
    error: null
};

const userReducer = (state = userInitialState, {type, payload}) => {
    switch (type) {
        case actions.KEY_FETCH_STARTED:
            return {
                ...state,
                isLoading: state.data.length === 0 ? true : false
            }

        case actions.KEY_FETCH_SUCCESS:
            return {
                ...state,
                telegramKey: payload,
                error: null,
                isLoading: false
            }

        case actions.KEY_FETCH_FAILED:
            return {
                ...state,
                error: payload,
                isLoading: false
            }


        default:
            return state
    }
}

export default userReducer;
