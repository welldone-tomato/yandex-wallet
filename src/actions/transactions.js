import * as action from './types';
import { signOutUser } from './auth';

import axios from 'axios';

const ROOT_URL = '/api';

/**
* Вытаскивает транзакции по картам пользователя
* 
* @returns 
*/
export const fetchTransactions = id => {
    return async dispatch => {
        try {
            dispatch({
                type: action.TRANS_FETCH_STARTED,
            });

            const response = await axios
                .get(`${ROOT_URL}/cards/${id}/transactions`, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            dispatch({
                type: action.TRANS_FETCH_SUCCESS,
                payload: response.data
            });
        } catch (err) {
            if (err.response.status === 401)
                dispatch(signOutUser('Ошибка авторизации'));

            dispatch({
                type: action.TRANS_FETCH_FAILED,
                payload: err.response.data.message ? err.response.data.message : err.response.data
            });
            console.log(err.response.data.message ? err.response.data.message : err.response.data);
        }
    }
}
