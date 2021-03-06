import * as actions from '../actions/types';

export const mrsInitialState = {
    // data: [],
    error: null,
    isLoading: false,
    createdLink: null,
    contract: null,
    loadingError: null
};

const mrsReducer = (state = mrsInitialState, {type, payload}) => {
    switch (type) {
        case actions.MR_FETCH_STARTED:
            return {
                ...state,
                isLoading: state.contract ? true : false
            }

        case actions.MR_FETCH_SUCCESS:
            return {
                ...state,
                contract: payload,
                loadingError: null,
                isLoading: false
            }

        case actions.MR_FETCH_FAILED:
            return {
                ...state,
                loadingError: payload
            }

        case actions.MR_ADD_RESET_STATUS:
            return {
                ...state,
                error: null,
                createdLink: null
            }

        case actions.MR_ADD_FAILED:
            return {
                ...state,
                error: payload,
                createdLink: null
            }

        case actions.MR_ADD_SUCCESS:
            return {
                ...state,
                error: null,
                createdLink: payload
            }

        case actions.USER_LOGOUT:
            return mrsInitialState

        default:
            return state
    }
}

export default mrsReducer;
