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

export const verifyToken = () => {
    return async dispatch => {
        const token = localStorage.getItem('token');
        if (token) {
            setStorageEvents(dispatch);

            dispatch({
                type: action.USER_TOKEN_VERIFY_START
            });

            try {
                const response = await axios
                    .get(VERIFY_URL, {
                        headers: {
                            authorization: 'JWT ' + token
                        }
                    });

                dispatch({
                    type: action.USER_LOGIN_SUCCESS,
                    payload: response.data.user
                });

                dispatch(fetchCards());

                dispatch(push('/'));
            } catch (err) {
                let message = 'Сеанс закончился';
                if (err.response.status === 401)
                    if (err.response.data.message === 'invalid token')
                        message = 'Ошибка авторизации';

                dispatch(signOutUser(message));
            }
        }
    }
}

export const signInUser = ({email, password}) => {
    return async dispatch => {
        try {
            const response = await axios
                .post(SIGNIN_URL, {
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

        dispatch({
            type: action.USER_LOGOUT,
            payload: err
        });

        dispatch(push('/signin'));
    }
};
