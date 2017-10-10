import * as action from './types';
import { fetchTransactions } from './transactions';

import axios from 'axios';

const ROOT_URL = '/api';

/**
* Вытаскивает данные по картам пользователя
* 
* @returns 
*/
export const fetchCards = () => {
    return async dispatch => {
        try {
            const response = await axios
                .get(`${ROOT_URL}/cards`, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            dispatch({
                type: action.FETCH_CARDS_SUCCESS,
                payload: response.data
            });

            if (response.data[0].id)
                dispatch(changeActiveCard(response.data[0].id));

        } catch (response) {
            dispatch({
                type: action.FETCH_CARDS_FAILED,
                payload: response.response.data.message ? response.response.data.message : response.response.data
            });
            console.log(response.response.data.message ? response.response.data.message : response.response.data);
        }
    }
}

/**
* Вытаскивает данные по карте пользователя
* 
* @param {Number} id 
* @returns 
*/
export const fetchCard = id => {
    return async dispatch => {
        try {
            const response = await axios
                .get(`${ROOT_URL}/cards/${id}`, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            dispatch({
                type: action.FETCH_CARD_SUCCESS,
                payload: response.data
            });

            dispatch(fetchTransactions(id));

        } catch (response) {
            dispatch({
                type: action.FETCH_CARD_FAILED,
                payload: response.response.data.message ? response.response.data.message : response.response.data
            });
            console.log(response.response.data.message ? response.response.data.message : response.response.data);
        }
    }
}

export const changeActiveCard = id => {
    return dispatch => {
        dispatch({
            type: action.ACTIVE_CARD_CHANGE,
            payload: id
        });
        dispatch(fetchTransactions(id));
    }
}
