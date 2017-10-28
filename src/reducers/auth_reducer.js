import * as actions from '../actions/types';

export const authInitialState = {
    isAuth: false,
    userName: null,
    error: null
};

const authReducer = (state = authInitialState, {type, payload}) => {
    switch (type) {
        case actions.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isAuth: true,
                error: null,
                userName: payload
            };
        case actions.USER_LOGIN_FAILURE:
            return {
                ...state,
                isAuth: false,
                error: payload
            };
        case actions.USER_LOGOUT:
            return authInitialState

        default:
            return state;
    }
};

export default authReducer;
