import { push } from 'react-router-redux';

import * as action from './types';

import axios from 'axios';

const ROOT_URL = 'http://localhost:4000';
// const LOGIN_URL = `${ROOT_URL}/signin`;
// const SIGNUP_URL = `${ROOT_URL}/signup`;

export const signingUser = () => {
    return dispatch => {
        dispatch({
            type: action.USER_LOGIN_SUCCESS
        });
        dispatch(push('/'));
    }
};

export const signOutUser = () => {
    return dispatch => {
        dispatch({
            type: action.USER_LOGOUT
        });
        dispatch(push('/'));
    }
};

export const fetchCards = () => {
    return (dispatch) => {
        axios
            .get(`${ROOT_URL}/cards`, {
                headers: {
                    authorization: 'JWT ' + localStorage.getItem('token')
                }
            })
            .then(result => {
                dispatch({
                    type: action.FETCH_CARDS_SUCCESS,
                    payload: result.data
                });
            })
            .catch(error => console.log(error));
    };
};
