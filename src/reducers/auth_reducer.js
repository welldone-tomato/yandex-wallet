import * as actions from '../actions/types';

export const authInitialState = {
    isAuthenticating: false,
    isAuth: false,
    userName: null,
    error: null
};

const authReducer = (state = authInitialState, {type, payload}) => {
    switch (type) {
        case actions.USER_TOKEN_VERIFY_START:
            return {
                ...state,
                isAuthenticating: true
            };

        case actions.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isAuth: true,
                error: null,
                userName: payload,
                isAuthenticating: false
            };
        case actions.USER_LOGIN_FAILURE:
            return {
                ...state,
                isAuth: false,
                error: payload,
                userName: null,
                isAuthenticating: false
            };
        case actions.USER_LOGOUT:
            return {
                ...state,
                isAuth: false,
                error: payload || null,
                userName: null,
                isAuthenticating: false
            };

        default:
            return state;
    }
};

export default authReducer;
