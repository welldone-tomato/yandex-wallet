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
                type: types.FETCH_CARDS
            },
            {
                type: types.FETCH_CARDS_SUCCESS,
                payload: cards
            },
            {
                type: types.ACTIVE_CARD_CHANGE,
                payload: id
            },
            {
                type: types.FETCH_TRANS
            }
        ];

        return store.dispatch(cardActions.fetchCards())
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('fetch card', () => {
        const expectedActions = [
            {
                type: types.FETCH_CARD_SUCCESS,
                payload: cards[0]
            }
        ];

        return store.dispatch(cardActions.fetchCard(id))
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('delete cards', () => {
        const expectedActions = [
            {
                type: types.DELETE_CARD
            },
            {
                type: types.DELETE_CARD_SUCCESS
            },
            {
                type: types.FETCH_CARDS
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
                type: types.FETCH_TRANS
            },
            {
                type: types.FETCH_TRANS_SUCCESS,
                payload: transactions
            }
        ];

        return store.dispatch(transactionsActions.fetchTransactions(id))
            .then(() => expect(store.getActions()).toEqual(expectedActions))
    });
});
