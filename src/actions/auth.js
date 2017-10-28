import { push } from 'react-router-redux';
import axios from 'axios';

import { fetchCards } from './cards';
import * as action from './types';

const ROOT_URL = '/api/auth';
const SIGNIN_URL = `${ROOT_URL}/signin`;
const SIGNUP_URL = `${ROOT_URL}/signup`;

export const signInUser = ({email, password}) => {
    return async dispatch => {
        try {
            const response = await axios
                .post(SIGNIN_URL, {
                    email,
                    password
                });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userName', response.data.user);

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

export const signOutUser = () => {
    return dispatch => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');

        dispatch({
            type: action.USER_LOGOUT
        });

        dispatch(push('/signin'));
    }
};
