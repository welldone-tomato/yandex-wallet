import * as action from './types';

import axios from 'axios';

const ROOT_URL = '/api';

/**
* Вытаскивает данные по картам пользователя
* 
*/
export const getTelegramKey = () => {
    return async dispatch => {
        try {
            dispatch({
                type: action.KEY_FETCH_STARTED
            });

            const response = await axios
                .get(`${ROOT_URL}/user/telegram-key`, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            dispatch({
                type: action.KEY_FETCH_SUCCESS,
                payload: response.data
            });


        } catch (err) {

            dispatch({
                type: action.KEY_FETCH_FAILED,
                payload: err.response.data.message ? err.response.data.message : err.response.data
            });
            console.log(err.response.data.message ? err.response.data.message : err.response.data);
        }
    }
}
