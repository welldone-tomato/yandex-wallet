export const API_END_POINT = '/api/';

// Mock localStorage
const localStorageMock = function() {
    let store = {};
    return {
        getItem: key => store[key],
        setItem: (key, value) => store[key] = value.toString(),
        clear: () => store = {},
        removeItem: key => delete store[key]
    };
}();

export const initLocalStorage = () => Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// mock data 
export const cards = [{
    id: 1,
    cardNumber: '546925000000000',
    balance: 15000,
    exp: '04/18',
    name: 'ALYSSA LIVINGSTON'
}];

export const transactions = [{
    id: 1,
    cardId: 1,
    type: 'prepaidCard',
    data: 'yandex money 33222335',
    time: 1506605528,
    sum: 10
}];

export const testAsyncAction = () => async dispatch => {
    setTimeout(() => dispatch({
        type: 'TEST_ASYNC_ACTION'
    }), 1);
}
