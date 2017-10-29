import moment from 'moment';
import { createSelector } from 'reselect';

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
            case 'card2Card': {
                typeTitle = 'Перевод на карту';
                break;
            }
            default: {
                typeTitle = 'Операция';
            }
        }

        return `${typeTitle}: ${item.data}`;
    };

    const sortedData = data.sort((a, b) => {
        if (a.time < b.time) return 1
        else if (a.time > b.time) return -1
        else return 0;
    });

    return sortedData.reduce((result, item) => {
        const {id, time, data, sum, type} = item;

        const key = moment.unix(time).format('L');

        let row = result.find(item => item.key === key);

        if (!row) {
            row = {
                key,
                data: []
            };
            result.push(row);
        }

        row.data.push({
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

    }, []);
};

const getTransactions = state => state.transactions.data;

export const getTransactionsByDays = createSelector(
    [getTransactions], transactions => separateByDates(transactions)
);
