import * as actions from '../actions/types';

const initialState = {
    isAuth: false,
    error: null
};

const authReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case actions.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isAuth: true,
                error: null
            };
        case actions.USER_LOGIN_FAILURE:
            return {
                ...state,
                isAuth: false,
                error: payload
            };
        case actions.USER_LOGOUT:
            return {
                ...state,
                isAuth: false,
                error: null
            };
        default:
            return state;
    }
};

export default authReducer;
