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
            .then(res => {
                dispatch({
                    type: action.FETCH_CARDS_SUCCESS,
                    payload: res.data
                });
                if (res.data[0].id)
                    dispatch(changeActiveCard(res.data[0].id));
            })
            .catch(res => {
                dispatch({
                    type: action.FETCH_CARDS_FAILED,
                    payload: res.response.data.message ? res.response.data.message : res.response.data
                });
                console.log(res.response.data.message ? res.response.data.message : res.response.data);
            });
    };
};

/**
* Вытаскивает обновленные данные по карте пользователя
* 
* @param {Number} id 
* @returns 
*/
export const fetchCard = (id) => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/cards/${id}`, {
                headers: {
                    authorization: 'JWT ' + localStorage.getItem('token')
                }
            })
            .then(res => {
                dispatch({
                    type: action.FETCH_CARD_SUCCESS,
                    payload: res.data
                });
                dispatch(fetchTransactions(id));
            })
            .catch(res => {
                dispatch({
                    type: action.FETCH_CARD_FAILED,
                    payload: res.response.data.message ? res.response.data.message : res.response.data
                });
                console.log(res.response.data.message ? res.response.data.message : res.response.data);
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
            .then(res => {
                dispatch({
                    type: action.FETCH_TRANS_SUCCESS,
                    payload: res.data
                });
            })
            .catch(res => {
                dispatch({
                    type: action.FETCH_TRANS_FAILED,
                    payload: res.response.data.message ? res.response.data.message : res.response.data
                });
                console.log(res.response.data.message ? res.response.data.message : res.response.data);
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
            .then(res => {
                if (res.status === 201) {
                    dispatch({
                        type: action.MOBILE_PAY_SUCCESS,
                        payload: transaction
                    });
                    dispatch(fetchCard(id));
                }
            })
            .catch(res => {
                dispatch({
                    type: action.MOBILE_PAY_FAILED,
                    payload: {
                        error: res.response.data.message ? res.response.data.message : res.response.data,
                        transaction
                    }
                });
                console.log(res.response.data.message ? res.response.data.message : res.response.data);
            });
    }
};

export const repeateMobileTransfer = () => {
    return dispatch => {
        dispatch({
            type: action.MOBILE_PAY_WISH_TO_REPEAT
        });
    }
};
