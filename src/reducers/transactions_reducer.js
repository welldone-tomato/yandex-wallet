import * as actions from '../actions/types';
import moment from 'moment';

const transactionsInitialState = {
    data: [],
    error: null
};

const separateByDates = data => {
    const getHistoryItemTitle = item => {
        let typeTitle = '';

        switch (item.type) {
            case 'paymentMobile': {
                typeTitle = 'Оплата телефона';
                break;
            }
            case 'prepaidCard': {
                typeTitle = 'Пополнение с карты';
                break;
            }
            case 'card2card': {
                typeTitle = 'Перевод на карту';
                break;
            }
            default: {
                typeTitle = 'Операция';
            }
        }

        return `${typeTitle}: ${item.data}`;
    };

    data = data.sort((a, b) => {
        if (a.time < b.time) return 1
        else if (a.time > b.time) return -1
        else return 0;
    });

    return data.reduce((result, item) => {
        const {id, time, data, sum, type} = item;

        const key = moment.unix(time).format('L');

        let value = result.get(key);

        if (!value) {
            value = [];
            result.set(key, value);
        }

        value.push({
            id,
            time,
            hhmm: moment.unix(time).format('HH:mm'),
            title: getHistoryItemTitle({
                type,
                data
            }),
            sum
        });

        return result;

    }, new Map());
};

const transactionsReducer = (state = transactionsInitialState, {type, payload}) => {
    switch (type) {
        case actions.FETCH_TRANS_SUCCESS:
            return {
                ...state,
                data: separateByDates(payload),
                error: null
            }
        case actions.FETCH_TRANS_FAILED:
            return {
                ...state,
                data: [],
                error: payload
            }
        case actions.FETCH_CARDS_FAILED:
            return transactionsInitialState
        case actions.USER_LOGOUT:
            return transactionsInitialState
        default:
            return state
    }
};

export default transactionsReducer;