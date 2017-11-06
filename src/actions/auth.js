import { push } from 'react-router-redux';
import axios from 'axios';

import { fetchCards } from './cards';
import * as action from './types';

const ROOT_URL = '/api/auth';
const VERIFY_URL = `${ROOT_URL}/verify`;
const SIGNIN_URL = `${ROOT_URL}/signin`;
const SIGNUP_URL = `${ROOT_URL}/signup`;

/**
 * Разлогинивается, если заметит изменение токена в другом окне
 * 
 */
const setStorageEvents = dispatch => {
    if (window) window.addEventListener('storage', e => {
            if (e.newValue === null && e.key === 'token')
                dispatch(signOutUser());
        });
}

const getCookie = cname => {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const verifyToken = () => {
    return async dispatch => {
        dispatch({
            type: action.USER_TOKEN_VERIFY_START
        });

        let token = localStorage.getItem('token');
        if (!token) {
            const cookieToken = getCookie('jwt');
            if (cookieToken) {
                localStorage.setItem('token', cookieToken);
                token = cookieToken;
            }
        }

        if (token) {
            try {
                const response = await axios
                    .get(VERIFY_URL, {
                        headers: {
                            authorization: 'JWT ' + token
                        }
                    });

                setStorageEvents(dispatch);

                dispatch({
                    type: action.USER_LOGIN_SUCCESS,
                    payload: response.data.user
                });

                dispatch(fetchCards());
            } catch (err) {
                let message = 'Сеанс закончился';
                if (err.response.status === 401)
                    if (err.response.data.message === 'invalid token')
                        message = 'Ошибка авторизации';

                dispatch(signOutUser(message));
            }
        }

        dispatch({
            type: action.USER_TOKEN_VERIFY_COMPLETE
        });
    }
}

export const signInUser = ({email, password} , redirect) => {
    return async dispatch => {
        try {
            const response = await axios
                .post(SIGNIN_URL, {
                    email,
                    password
                }, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                });

            localStorage.setItem('token', response.data.token);

            dispatch({
                type: action.USER_LOGIN_SUCCESS,
                payload: response.data.user
            });

            dispatch(fetchCards());

            if (redirect) dispatch(push(redirect));
            else dispatch(push('/'));
        } catch (response) {
            dispatch({
                type: action.USER_LOGIN_FAILURE,
                payload: response.response.data.message ? response.response.data.message : response.response.data
            });
            console.log(response.response.data.message ? response.response.data.message : response.response.data);
        }
    }
};

export const signUpUser = ({email, password}) => {
    return async dispatch => {
        try {
            const response = await axios
                .post(SIGNUP_URL, {
                    email,
                    password
                });

            localStorage.setItem('token', response.data.token);

            dispatch({
                type: action.USER_LOGIN_SUCCESS,
                payload: response.data.user
            });

            dispatch(fetchCards());

            dispatch(push('/'));
        } catch (response) {
            dispatch({
                type: action.USER_LOGIN_FAILURE,
                payload: response.response.data.message ? response.response.data.message : response.response.data
            });
            console.log(response.response.data.message ? response.response.data.message : response.response.data);
        }
    }
};

export const signOutUser = err => {
    return dispatch => {
        localStorage.removeItem('token');

        if (document.cookie)
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        dispatch({
            type: action.USER_LOGOUT,
            payload: err
        });

        dispatch(push('/signin'));
    }
};
