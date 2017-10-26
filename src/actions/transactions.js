import * as action from './types';

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
        } catch (response) {
            dispatch({
                type: action.TRANS_FETCH_FAILED,
                payload: response.response.data.message ? response.response.data.message : response.response.data
            });
            console.log(response.response.data.message ? response.response.data.message : response.response.data);
        }
    }
}
