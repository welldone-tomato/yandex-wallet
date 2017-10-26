import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as cardActions from '../../actions/cards';
import * as transactionsActions from '../../actions/transactions';
import * as types from '../../actions/types';
import { API_END_POINT, cards, transactions, initLocalStorage } from '../common';

const mockStore = configureMockStore([thunk]);
const {id} = cards[0];

beforeAll(() => {
    initLocalStorage();

    const mock = new MockAdapter(axios);

    mock.onGet(API_END_POINT + 'cards').reply(200, cards);
    mock.onGet(API_END_POINT + `cards/${id}`).reply(200, cards[0]);
    mock.onDelete(API_END_POINT + `cards/${id}`).reply(200);
    mock.onGet(API_END_POINT + `cards/${id}/transactions`).reply(200, transactions);
});

let store;

beforeEach(() => store = mockStore({
    cards: {}
}));

describe('async cards actions', () => {
    it('fetch cards', () => {
        const expectedActions = [
            {
                type: types.CARDS_FETCH_STARTED
            },
            {
                type: types.CARDS_FETCH_SUCCESS,
                payload: cards
            },
            {
                type: types.ACTIVE_CARD_CHANGED,
                payload: id
            },
            {
                type: types.TRANS_FETCH_STARTED
            }
        ];

        return store.dispatch(cardActions.fetchCards())
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('fetch card', () => {
        const expectedActions = [
            {
                type: types.CARD_FETCH_SUCCESS,
                payload: cards[0]
            }
        ];

        return store.dispatch(cardActions.fetchCard(id))
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('delete cards', () => {
        const expectedActions = [
            {
                type: types.CARD_DELETE_STARTED
            },
            {
                type: types.CARD_DELETE_SUCCESS
            },
            {
                type: types.CARDS_FETCH_STARTED
            }
        ];

        return store.dispatch(cardActions.deleteCard(id))
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
});

describe('async transactions actions', () => {
    it('fetch transactions', () => {
        const expectedActions = [
            {
                type: types.TRANS_FETCH_STARTED
            },
            {
                type: types.TRANS_FETCH_SUCCESS,
                payload: transactions
            }
        ];

        return store.dispatch(transactionsActions.fetchTransactions(id))
            .then(() => expect(store.getActions()).toEqual(expectedActions))
    });
});
