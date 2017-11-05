import * as action from './types';
import axios from 'axios';

import { signOutUser } from './auth';

const ROOT_URL = '/api';

/**
* Добавляет новый money requests пользователю
* 
*/
export const addMr = (cardId, sum, goal) => {
    return async dispatch => {
        try {
            dispatch({
                type: action.MR_ADD_STARTED
            });

            const data = {
                cardId,
                sum,
                goal
            };

            const response = await axios
                .post(`${ROOT_URL}/mrs`, data, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            if (response.status === 201 && response.data.url) {
                dispatch({
                    type: action.MR_ADD_SUCCESS,
                    payload: response.data.url
                });
            }
            else dispatch({
                    type: action.MR_ADD_FAILED,
                    payload: 'Что то пошло не так...'
                });
        } catch (err) {
            if (err.response.status === 401)
                dispatch(signOutUser('Ошибка авторизации'));

            dispatch({
                type: action.MR_ADD_FAILED,
                payload: err.response.data.message ? err.response.data.message : err.response.data
            });
            console.log(err.response.data.message ? err.response.data.message : err.response.data);
        }
    }
}

/**
* Получает money requests по ссылке
* 
*/
export const getMr = guid => {
    return async dispatch => {
        try {
            dispatch({
                type: action.MR_FETCH_STARTED
            });

            const response = await axios
                .get(`${ROOT_URL}/mrs/${guid}`, {
                    headers: {
                        authorization: 'JWT ' + localStorage.getItem('token')
                    }
                });

            if (response.status === 200 && response.data) {
                dispatch({
                    type: action.MR_FETCH_SUCCESS,
                    payload: response.data
                });
            }
            else dispatch({
                    type: action.MR_FETCH_FAILED,
                    payload: 'Что то пошло не так...'
                });
        } catch (err) {
            if (err.response.status === 401)
                dispatch(signOutUser('Ошибка авторизации'));

            dispatch({
                type: action.MR_FETCH_FAILED,
                payload: err.response.data.message ? err.response.data.message : err.response.data
            });
            console.log(err.response.data.message ? err.response.data.message : err.response.data);
        }
    }
}