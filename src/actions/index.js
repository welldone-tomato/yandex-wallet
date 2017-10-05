import { push } from 'react-router-redux';

import * as action from './types';

import axios from 'axios';

const ROOT_URL = '/api';
// const LOGIN_URL = `${ROOT_URL}/signin`;
// const SIGNUP_URL = `${ROOT_URL}/signup`;

export const signingUser = () => {
    return dispatch => {
        dispatch({
            type: action.USER_LOGIN_SUCCESS
        });

        dispatch(push('/cards'));
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

/**
* Вытаскивает данные по картам пользователя
* 
* @returns 
*/
export const fetchCards = () => {
    return dispatch => {
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
                if (result.data[0].id)
                    dispatch(changeActiveCard(result.data[0].id));
            })
            .catch(error => {
                dispatch({
                    type: action.FETCH_CARDS_FAILED,
                    payload: error
                });
                console.log(error);
            });
    };
};

/**
* Вытаскивает данные по картам пользователя
* 
* @returns 
*/
export const fetchTransactions = id => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/cards/${id}/transactions`, {
                headers: {
                    authorization: 'JWT ' + localStorage.getItem('token')
                }
            })
            .then(result => {
                dispatch({
                    type: action.FETCH_TRANS_SUCCESS,
                    payload: result.data
                });
            })
            .catch(error => {
                dispatch({
                    type: action.FETCH_TRANS_FAILED,
                    payload: error
                });
                console.log(error);
            });
    };
};

export const changeActiveCard = id => {
    return dispatch => {
        dispatch({
            type: action.CHANGE_ACTIVE_CARD,
            payload: id
        });
        dispatch(fetchTransactions(id));
    }
};

export const mobilePayment = (transaction, id) => {
    // формируем транзакцию
    const apiTransaction = {
        type: 'paymentMobile',
        data: transaction.phoneNumber,
        time: Date.now() / 1000,
        sum: transaction.sum < 0 ? transaction.sum : transaction.sum * -1
    };

    return dispatch => {
        axios
            .post(`${ROOT_URL}/cards/${id}/transactions`, apiTransaction, {
                headers: {
                    authorization: 'JWT ' + localStorage.getItem('token')
                }
            })
            .then(result => {
                if (result.status === 201) {
                    dispatch({
                        type: action.MOBILE_PAY_SUCCESS
                    });
                    dispatch(fetchTransactions(id));
                }
            })
            .catch(error => {
                dispatch({
                    type: action.MOBILE_PAY_FAILED,
                    payload: error
                });
                console.log(error);
            });
    }
};
